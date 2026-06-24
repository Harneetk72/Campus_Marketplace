import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/product/my-listing");

      setProducts(res.data.data || []);
      console.log("Fetched Products:", res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // STATS
  const totalProducts = products.length;

  const totalCategories = [...new Set(products.map((p) => p.category))].length;

  const totalStock = products.reduce((acc, item) => acc + item.quantity, 0);

  const averagePrice =
    products.length > 0
      ? Math.floor(
          products.reduce((acc, item) => acc + item.price, 0) / products.length,
        )
      : 0;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>{user?.userName || "User"}'s Dashboard</h1>
          <p>Manage your products and inventory overview.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Products</span>
          <h2>{totalProducts}</h2>
        </div>

        <div className="stat-card">
          <span>Total Categories</span>
          <h2>{totalCategories}</h2>
        </div>

        <div className="stat-card">
          <span>Total Stock</span>
          <h2>{totalStock}</h2>
        </div>

        <div className="stat-card">
          <span>Average Price</span>
          <h2>₹{averagePrice}</h2>
        </div>
      </div>

      {/* RECENT PRODUCTS */}
      <div className="recent-section">
        <h2>Recently Added Products</h2>
        <div className="product-list">
          {products.map((item) => (
            <div
              className="product-card"
              key={item._id}
              onClick={() => handleProductClick(item._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-left">
                <img src={item.images?.[0]?.url} alt={item.title} />

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.category}</p>

                  <small>₹{item.price}</small>
                </div>
              </div>

              <div className="product-right">
                <span
                  className={
                    item.quantity > 5
                      ? "status in-stock"
                      : item.quantity > 0
                        ? "status low-stock"
                        : "status out-stock"
                  }
                >
                  {item.quantity > 5
                    ? "In Stock"
                    : item.quantity > 0
                      ? "Low Stock"
                      : "Out Of Stock"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
