import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [basketItemsCount, setBasketItemsCount] = useState(0);
  const [basketId, setBasketId] = useState(null);
  const [basketItems, setBasketItems] = useState({}); // Stores productId -> { itemId, quantity, product.name, product.img, product.price }



  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();
  
  // function to retrieve the newest active basket
  const fetchActiveBasket = async () => {
    try {
      const response = await api.get(`/user/${userId}/basket/active-basket`);
      if (response.data) setBasketId(response.data.id);
    } catch (err) {
      console.error("Error fetching active basket", err);
    }
  };

  useEffect(() => {

    fetchActiveBasket(); //fetch basket and set basket id as soon the page loads
    //or the user changes.

    const fetchUser = async () => { //to get the user's name and display
      try {
        const response = await api.get(`/user/${userId}`);
        setCustomer(response.data.name);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Could not retrieve user data.");
      }
    };

    fetchUser();
  }, [userId]); //this function will run everytime the user#id changes or the page loads

  //fetch products to display on the web page
  useEffect(() => {
    if (!basketId) return;

    const fetchProducts = async () => {
      try {
        const response = await api.get(`/product?pgNum=${currentPage}&pgSize=${pageSize}`);
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [basketId, currentPage, pageSize]);


  const fetchBasketItemCount = async () => {
    try {
      const response = await api.get(`/user/${userId}/basket/${basketId}/quant-of-items`);
      setBasketItemsCount(response.data);
    } catch (err) {
      console.error("Error fetching basket count:", err);
    }
  };

  const fetchItemsInBasket = async () => {
    try {
      const response = await api.get(`/basket/${basketId}/item`);
      const items = response.data;
  
      console.log("Items from fetchItemsInBasket:", items);
  
      // Create a new basket state in one go
      const updatedBasket = items.reduce((acc, item) => {
        const product = item.product;
        acc[product.id] = {
          itemId: item.id,
          quantity: item.quantity,
          imgSource: product.imageSrc,
          header: product.productName,
          price: product.productPrice
        };
        return acc;
      }, {});
  
      setBasketItems(updatedBasket);
    } catch (err) {
      console.error("Error fetching Items in Basket", err);
    }
  };
  

  useEffect(() => { // to get the total amount of items in a basket
    if (!basketId) return;    

    fetchBasketItemCount();
    fetchItemsInBasket();
  }, [basketId]);


  const addProductToBasket = async (product) => {
    if (!basketId && !product){
      return;
    } 

    const productId = product.id;

    try {
      await api.post(`/basket/${basketId}/item?productId=${productId}&quant=1`);

      setBasketItemsCount((prevCount) => prevCount + 1);
        
      await fetchItemsInBasket();   

    } catch (err) {
      console.error("Error adding product:", err);  
    }
};

const incrementProductQuantity = async (product) => {
  const productId = product.id;
  const item = basketItems[productId];

  if (!item) return;

  // Optimistically update the UI
  setBasketItems((prev) => ({
    ...prev,
    [productId]: { ...item, quantity: item.quantity + 1 },
  }));

  setBasketItemsCount((prevCount) => prevCount + 1);

  try {

    await api.post(`/basket/${basketId}/item/${item.itemId}/increment`);
  } catch (err) {
    console.error("Error increasing item quantity:", err);

  }
};

const decrementProductQuantity = async (product) => {
  const productId = product.id;
  const item = basketItems[productId];

  if (!item || item.quantity <= 0) return;

  const updatedQuantity = item.quantity - 1;

  setBasketItems((prev) => {
    let updatedBasket;
    
    if (updatedQuantity > 0) {
      updatedBasket = { ...prev, [productId]: { ...item, quantity: updatedQuantity } };
    } else {
      updatedBasket = { ...prev };
      delete updatedBasket[productId]; // Remove item if quantity is 0
    }

    return updatedBasket;
  });
  

  setBasketItemsCount((prevCount) => Math.max(prevCount - 1, 0));// Prevent negative count

  try {
      await api.post(`/basket/${basketId}/item/${item.itemId}/decrement`);
  } catch (err) {
      console.error("Error decreasing item quantity:", err);
  }
};

const handleCheckout = async () => {  

  try {

    const response = await api.post(`user/${userId}/order/create-order`);
    
    
    if (!response || !response.data) {
      console.error("Checkout response is empty");
      return;
    }

    navigate('/order');

  } catch (err) {
    console.error("Checkout failed:", err);
  }  
  
};

  if (loading) return <div className={styles.spinner}>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles["page-container"]}>
      <header className={styles["dashboard-header"]}>
          <h2>Welcome, {customer}!</h2>
      </header>
      <div className={styles["middle-container"]}>    
        <div className={styles["products-container"]}>

          <h2 className={styles.category}>Miscellaneous</h2>

          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((product) => (
              <div className={styles.product} key={product.id}>
                <img src={`/${product.imageSrc}` || "placeholder.jpg"} alt={`${product.productName} photo`} />

                <span className={styles.resume}>{product.productName}</span>
                <span className={styles.description}>{product.productDescription} </span>
                <span className={styles.price}>€ {product.productPrice.toFixed(2)}</span>

                {/* Store product id, image and description and price to be used in */}

                {basketItems[product.id] ? (                  
                  <div className={`${styles.btn} ${styles["no-cart"]}`}>
                    <button className={styles.decrement} onClick={() => decrementProductQuantity(product)}>
                      <img src="/images/icon-decrement-quantity.svg" alt="minus symbol"/>
                    </button>
                    <span className={styles.quantity}>{basketItems[product.id].quantity}</span>
                    <button className={styles.increment} onClick={() => incrementProductQuantity(product)}>
                      <img src="/images/icon-increment-quantity.svg" alt="plus symbol" />
                    </button>
                  </div>                 
                ) : (
                  <button
                    className={styles.btn}
                    onClick={() => addProductToBasket(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Basket"}
                  </button>
                )}                
              </div>
            ))
          )}
        </div>

        <div className={`${styles["cart-container"]} ${Object.keys(basketItems).length === 0 ? styles["empty-cart"] : styles["filled-cart"]}`}>

          <h3>Your Cart ({basketItemsCount})</h3>

          {Object.keys(basketItems).length === 0 ? (
            <div>
              <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /> 
                <circle cx="20" cy="21" r="1" /> 
                <path d="M1 1h4l3.6 10.8a2 2 0 0 0 1.9 1.4h7.5a2 2 0 0 0 1.9-1.3L23 6H6" />
              </svg>
              <p className="added-items">Your added items will appear here</p>
            </div>
          ) : (
            <>
              {Object.entries(basketItems).map(([productId, item]) => (
                <div key={item.itemId} className={styles["cart-item"]}>
                  <img className={styles.miniature} src={`/${item.imgSource}` || "placeholder.jpg"} alt={`${item.header} photo`} />
                  <div className={styles["item-content"]}>
                    <span className={styles["item-header"]}> {item.header} </span>
                    <span>{item.quantity} un @ {item.price} =  € {(item.quantity * item.price).toFixed(2)}</span>
                  </div>               
                </div>
              ))}          
              <hr/>    
              <div className={styles["check-container"]}>
                  <button className={styles.checkout} onClick={handleCheckout}>Check Out</button>
              </div>
            </>
          )}
        </div>

      </div>

      <footer className={styles["footer-container"]}>

        <a href="https://www.linkedin.com/in/fabiosoaresdelima/" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" width="40" height="40" />
        </a>

        <a href="https://github.com/Fabiosdl" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width="40" height="40"/>
        </a>

        <a href="mailto:fabiosdl@outlook.com">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg" alt="Email" width="40" height="40"/>
        </a>

      </footer>
    </div>
  );
};

export default Dashboard;