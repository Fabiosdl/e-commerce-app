import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

import './Dashboard.css';

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
  const [basketItems, setBasketItems] = useState({}); // Stores productId -> { itemId, quantity }



  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveBasket = async () => {
      try {
        const response = await api.get(`/user/${userId}/basket/active-basket`);
        if (response.data) setBasketId(response.data.id);
      } catch (err) {
        console.error("Error fetching active basket", err);
      }
    };

    fetchActiveBasket();

    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/${userId}`);
        setCustomer(response.data.name);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Could not retrieve user data.");
      }
    };

    fetchUser();
  }, [userId]);

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

  useEffect(() => {
    if (!basketId) return;

    const fetchBasketItemCount = async () => {
      try {
        const response = await api.get(`/user/${userId}/basket/${basketId}/quant-of-items`);
        setBasketItemsCount(response.data);
      } catch (err) {
        console.error("Error fetching basket count:", err);
      }
    };

    fetchBasketItemCount();
  }, [basketId]);

  const addProductToBasket = async (productId) => {
    if (!basketId) return;

    try {
        const response = await api.post(`/basket/${basketId}/item?productId=${productId}&quant=1`);
        
        if (response.data && response.data.id) {
            setBasketItems(prev => ({
                ...prev,
                [productId]: {
                    itemId: response.data.id,  // Store itemId
                    quantity: (prev[productId]?.quantity || 0) + 1 // Update quantity
                }
            }));
        }

        setBasketItemsCount(prevCount => prevCount + 1);
    } catch (err) {
        console.error("Error adding product:", err);
        alert("Error adding product to basket.");
    }
};


  const incrementProductQuantity = async (productId) => {
    const item = basketItems[productId];
    if (!item || !item.itemId) return;

    try {
        await api.post(`/basket/${basketId}/item/${item.itemId}/increment`);
        
        setBasketItems(prev => ({
            ...prev,
            [productId]: { ...item, quantity: item.quantity + 1 }
        }));

        setBasketItemsCount(prevCount => prevCount + 1);
    } catch (err) {
        console.error("Error increasing item quantity:", err);
    }
};

const decrementProductQuantity = async (productId) => {
    const item = basketItems[productId];
    if (!item || !item.itemId || item.quantity === 0) return;

    try {
        await api.post(`/basket/${basketId}/item/${item.itemId}/decrement`);

        setBasketItems(prev => {
            const updatedQuantity = item.quantity - 1;

            if (updatedQuantity > 0) {
                return { ...prev, [productId]: { ...item, quantity: updatedQuantity } };
            } else {
                // Remove product from state if quantity is 0
                const newBasketItems = { ...prev };
                delete newBasketItems[productId];
                return newBasketItems;
            }
        });

        setBasketItemsCount(prevCount => prevCount - 1);
    } catch (err) {
        console.error("Error decreasing item quantity:", err);
    }
};

  const handleCheckout = async () => {
    if (basketItemsCount === 0) {
      alert("Your basket is empty!");
      return;
    }

    try {
      const response = await api.patch(`user/${userId}/basket/${basketId}/checkout`);
      if (!response || !response.data) {
        console.error("Checkout response is empty");
        return;
      }

      await fetchActiveBasket();
      navigate("/order");
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page-container">
      <header className="dashboard-header">
          <h2>Welcome, {customer}!</h2>
          <div className="basket-info">
            <a href="/order"><img className="imgBasket" src="/images/icon-add-to-cart.svg" alt="basket" /><span className="itemsCount">{basketItemsCount}</span>  </a>

          </div>
      </header>    
      <div className="products-container">

        <h2 className="category">Miscellaneous</h2>

        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div className="product" key={product.id}>
              <img src={`/${product.imageSrc}` || "placeholder.jpg"} alt={`${product.productName} photo`} />

              <span className="resume">{product.productName}</span>
              <span className="description">{product.productDescription} </span>
              <span className="price">${product.productPrice.toFixed(2)}</span>

              {basketItems[product.id] ? (
                <div className="btn no-cart">
                  <button className="decrement" onClick={() => decrementProductQuantity(product.id)}>
                    <img src="/images/icon-decrement-quantity.svg"/>
                  </button>
                  <span className="quantity">{basketItems[product.id].quantity}</span>
                  <button className="increment" onClick={() => incrementProductQuantity(product.id)}>
                    <img src="/images/icon-increment-quantity.svg"/>
                  </button>
                </div>
              ) : (
                <button
                  className="btn"
                  onClick={() => addProductToBasket(product.id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Basket"}
                </button>
              )}
              
            </div>
          ))
        )}
      </div>

      <footer className="footer-container">

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