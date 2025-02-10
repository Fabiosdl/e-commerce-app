import React, { useState, useEffect } from "react";
import api from "../api";

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(25); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [basketItemsCount, setBasketItemsCount] = useState(0);
  const [basketId, setBasketId] = useState(0);
  const [basketUpdated, setBasketUpdated] = useState(false); // 👈 Trigger state

  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const getBasketid = Number(localStorage.getItem('basketId'));
    if(getBasketid)
      setBasketId(getBasketid);
  },[]);

  useEffect(() => {

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
  }, [currentPage, pageSize]);

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
  },[basketUpdated]); //👈 Re-fetch when `basketUpdated` changes

  const addItemToBasket = async (productId) => {
    if (!basketId) {
      console.log("Basket not initialized yet.");
      return;
    }

    try {
      //add item to basket
      await api.post(`/basket/${basketId}/item/add-item?productId=${productId}&quant=1`);
    
      // Toggle `basketUpdated` state to trigger `useEffect`
      setBasketUpdated(prev => !prev); // 👈 This forces `useEffect` to run
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Welcome, Customer!</h2>

      <div>
        <h3>Basket</h3>
        <p>Total Items in Basket: {basketItemsCount}</p>
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
              <button onClick={() => addItemToBasket(product.id)}>Add to Basket</button>
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
