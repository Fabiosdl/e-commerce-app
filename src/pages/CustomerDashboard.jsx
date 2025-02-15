import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(25); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [basketItemsCount, setBasketItemsCount] = useState(0);
  const [basketId, setBasketId] = useState(null); // Basket ID state

  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  const fetchActiveBasket = async () => {
    try {
      const response = await api.get(`/user/${userId}/basket/active-basket`);
      if(response.data)
        setBasketId(response.data.id);
    } catch (err) {
      console.error("Error fetching active basket", err);
    }
  };

  useEffect(() => {

    fetchActiveBasket(); //fetch basket and set basket id as soon the page loads
    //or the user changes.
    
    const fetchUser = async () => {
      try {
        
        const response = await api.get(`/user/${userId}`);
        setCustomer(response.data.name);

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Could not retrieve active basket.");
      }
    };
    fetchUser();
  }, [userId]);

  // Fetch products after basket is initialized
  useEffect(() => {

    if(!basketId) return; //Only run when basket id is available

    const fetchProducts = async () => {
      try {
        const response = await api.get(`/product?pgNum=${currentPage}&pgSize=${pageSize}`);
        setProducts(response.data.content); // Assuming backend response has a 'content' field
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [basketId, currentPage, pageSize]); //when one of these variables change, the function will run

  useEffect(() => {
    const fetchBasketItemCount = async () => {
      if (!basketId) return;

      try {
        const response = await api.get(`/user/${userId}/basket/${basketId}/quant-of-items`);
        setBasketItemsCount(response.data);
      } catch (err) {
        console.error("Error fetching basket count:", err);
      }
    };

    fetchBasketItemCount();
  }, [basketId]); // Run this effect only when basketId changes

  const addProductToBasket = async (productId) => {
    if (!basketId) {
      return;
    }

    try {
      await api.post(`/basket/${basketId}/item?productId=${productId}&quant=1`);
      setBasketItemsCount((prevCount) => prevCount + 1);
      alert("Product added to basket!");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product to basket.");
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

      navigate('/order');

    } catch (err) {
      console.error("Checkout failed:", err);
    }  
    
  };

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  if (loading) return <div className="spinner">Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {customer}!</h1>

      <div>
        <h3>Basket</h3>
        <p>Total Items in Basket: {basketItemsCount}</p>
        <br/>
        <button onClick={handleCheckout}>Check Out</button>
      </div>

      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <span>
                {product.productName} ${product.productPrice}
              </span>
              <button 
                onClick={() => addProductToBasket(product.id)} 
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Basket"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;