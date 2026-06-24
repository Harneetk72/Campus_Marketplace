  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import apiClient from "../api/apiClient";

  const MyListing = () => {
    const navigation = useNavigate();

    const [products, setProducts] = useState([]);

    // FETCH MY PRODUCTS
    const fetchMyProducts = async () => {
      try {
        const res = await apiClient.get("/product/my-listing");

        setProducts(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      fetchMyProducts();
    }, []);

    // DELETE PRODUCT
    const handleDelete = async (id) => {
      try {
        await apiClient.delete(`/product/delete/${id}`);

        setProducts((prev) =>
          prev.filter((item) => item._id !== id)
        );
      } catch (err) {
        console.log(err);
      }
    };

    // CREATE PRODUCT PAGE
    const handleCreateProduct = () => {
      navigation("/create");
    };

    return (
      <div className="products-container">
        {/* HEADER */}
        <div className="products-header">
          <div>
            <h1>My Listings</h1>
            <p>Your uploaded products</p>
          </div>

          <button
            className="create-btn"
            onClick={handleCreateProduct}
          >
            + Create Product
          </button>
        </div>

        {/* PRODUCTS GRID */}
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item._id} className="product-card">
                {/* IMAGE */}
                <div className="product-image">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.title}
                  />
                </div>

                {/* CONTENT */}
                <div className="product-content">
                  <p className="category">{item.category}</p>

                  <h2>{item.title}</h2>

                  <div className="price-row">
                    <span>₹{item.price}</span>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      {/* VIEW */}
                      <button
                        onClick={() =>
                          navigation(`/product/${item._id}`)
                        }
                      >
                        →
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "40px",
                fontSize: "18px",
              }}
            >
              No products found
            </p>
          )}
        </div>
      </div>
    );
  };

  export default MyListing;