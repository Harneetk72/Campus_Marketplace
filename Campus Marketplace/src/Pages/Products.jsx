import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const Products = () => {
  const navigation = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/product/");
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleCreateProduct = () => {
    navigation("/create");
  };

  return (
    <div className="products-container">
      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Browse and manage items</p>
        </div>

        <button className="create-btn" onClick={handleCreateProduct}>
          + Create Product
        </button>
      </div>

      {/* Grid */}
      <div className="products-grid">
        {products.map((item) => (
          <div key={item._id} className="product-card" onClick={() => navigation(`/product/${item._id}`)}>
            <div className="product-image">
              <img src={item.images?.[0]?.url} alt={item.title} />
            </div>

            <div className="product-content">
              <p className="category">{item.category}</p>
              <h2>{item.title}</h2>
              <div className="price-row">
                <span>₹{item.price}</span>

                <button onClick={() => navigation(`/product/${item._id}`)}>
                  →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
