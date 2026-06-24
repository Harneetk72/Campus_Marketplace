import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";

import apiClient from "../api/apiClient";

const Wishlist = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH WISHLIST
  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res =
        await apiClient.get(
          "/wishlist/"
        );

      setProducts(
        res.data.products || []
      );
    } catch (error) {
      console.log( " wishlist ",error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // REMOVE PRODUCT
  const removeWishlist =
    async (id) => {
      try {
        await apiClient.delete(
          `/wishlist/remove/${id}`
        );

        setProducts((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  // LOADING
  if (loading) {
    return (
      <div className="wishlist-loading">
        <h1>Loading Wishlist...</h1>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      {/* HEADER */}
      <div className="wishlist-header">

        <div>
          <h1>My Wishlist</h1>

          <p>
            {products.length} items
            saved for later
          </p>
        </div>

        <button className="wishlist-cart-btn">
          <FaShoppingCart />

          <span>
            Buy All Items
          </span>
        </button>

      </div>

      {/* GRID */}
      <div className="wishlist-grid">

        {products.length > 0 ? (
          products.map((item) => (
            <div
              className="wishlist-card"
              key={item._id}
            >

              {/* IMAGE */}
              <div className="wishlist-image">

                <img
                  src={
                    item?.images?.[0]
                      ?.url ||
                    "https://placehold.co/600x600?text=No+Image"
                  }
                  alt={item.title}
                />

              </div>

              {/* CONTENT */}
              <div className="wishlist-content">

                <div className="wishlist-top">

                  <span className="wishlist-category">
                    {item.category}
                  </span>

                  <button className="heart-icon">
                    <FaHeart />
                  </button>

                </div>

                <h2>
                  {item.title}
                </h2>

                <h3>
                  ₹{item.price}
                </h3>

                <p>
                  {item.description}
                </p>

                {/* ACTIONS */}
                <div className="wishlist-actions">

                  <button className="cart-btn">
                    <FaShoppingCart />

                    Buy Now
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeWishlist(
                        item._id
                      )
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="empty-state">

            <FaHeart className="empty-heart" />

            <h2>
              Your Wishlist is Empty
            </h2>

            <p>
              Save products you
              love here.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default Wishlist;