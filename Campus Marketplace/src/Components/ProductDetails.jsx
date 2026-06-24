  import React, {
    useEffect,
    useState,
  } from "react";

  import {
    useParams,
    useNavigate,
  } from "react-router-dom";

  import {
    FaHeart,
    FaRegHeart,
  } from "react-icons/fa";

  import { toast } from "react-toastify";

  import apiClient from "../api/apiClient";

  import OrderForm from "../components/OrderForm";

  const ProductDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] =
      useState(null);

    const [mainImage, setMainImage] =
      useState("");

    const [wishlistLoading, setWishlistLoading] =
      useState(false);

    const [isWishlisted, setIsWishlisted] =
      useState(false);

    // ORDER FORM STATE
    const [showOrderForm,
      setShowOrderForm] =
      useState(false);

    // FETCH PRODUCT
    useEffect(() => {

      const fetchProduct =
        async () => {

        try {

          const res =
            await apiClient.get(
              `/product/${id}`
            );

          setProduct(
            res.data.product
          );

          setMainImage(
            res.data.product
              ?.images?.[0]?.url || ""
          );

        } catch (error) {

          console.log(error);

        }
      };

      fetchProduct();

    }, [id]);

    // CHECK WISHLIST
    useEffect(() => {

      const checkWishlist =
        async () => {

        try {

          const res =
            await apiClient.get(
              "/wishlist"
            );

          const exists =
            res.data.products.some(
              (item) =>
                String(item._id) ===
                String(id)
            );

          setIsWishlisted(exists);

        } catch (error) {

          console.log(error);

        }
      };

      checkWishlist();

    }, [id]);

    // LOADING
    if (!product) {

      return (
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          Loading...
        </h1>
      );
    }

    const sellerName =
      product?.seller?.userName ||
      "Seller";

    // CHAT
    const HandleSellerChat = () => {

      navigate(
        `/chat/${product.seller._id}`,
        {
          state: {
            seller:
              product.seller,
          },
        }
      );
    };

    // WISHLIST
    const handleWishlist =
      async () => {

      try {

        if (isWishlisted) {

          await apiClient.delete(
            `/wishlist/remove/${product._id}`
          );

          setIsWishlisted(false);

          toast.success(
            "Removed from wishlist"
          );

        } else {

          await apiClient.post(
            `/wishlist/add/${product._id}`
          );

          setIsWishlisted(true);

          toast.success(
            "Added to wishlist"
          );
        }

      } catch (error) {

        console.log(error);

      }
    };

    return (

      <div className="product-details-container">

        {/* ORDER FORM */}
        {
          showOrderForm && (

            <OrderForm
              productId={product._id}
              onClose={() =>
                setShowOrderForm(false)
              }
            />

          )
        }

        <div className="product-details-card">

          {/* HEART */}
          <div className="top-actions">

            <button
              className={`wishlist-icon-btn ${
                isWishlisted
                  ? "active"
                  : ""
              }`}
              onClick={handleWishlist}
              disabled={
                wishlistLoading
              }
            >

              {wishlistLoading
                ? "..."
                : isWishlisted
                ? <FaHeart />
                : <FaRegHeart />
              }

            </button>

          </div>

          {/* IMAGE */}
          <div className="product-image-section">

            <img
              src={mainImage}
              alt="product"
              className="product-main-image"
            />

            <div className="thumbnail-wrapper">

              {
                product?.images?.map(
                  (img, index) => (

                    <img
                      key={index}
                      src={img.url}
                      alt=""
                      className="thumbnail-image"
                      onClick={() =>
                        setMainImage(
                          img.url
                        )
                      }
                    />

                  )
                )
              }

            </div>

          </div>

          {/* CONTENT */}
          <div className="product-content">

            <span className="product-category">
              {product.category}
            </span>

            <h1 className="product-title">
              {product.title}
            </h1>

            <h2 className="product-price">
              ₹{product.price}
            </h2>

            {/* SELLER */}
            <div className="glass-card seller-card">

              <div className="seller-left">

                <div className="seller-avatar">
                  {sellerName[0]}
                </div>

                <div>

                  <h3 className="seller-name">
                    {sellerName}
                  </h3>

                  <p className="seller-subtitle">
                    Verified Seller
                  </p>

                </div>

              </div>

            </div>

            {/* INFO */}
            <div className="product-info">

              <div className="info-box">

                <p className="info-label">
                  CATEGORY
                </p>

                <p className="info-value">
                  {product.category}
                </p>

              </div>

              <div className="info-box">

                <p className="info-label">
                  QUANTITY
                </p>

                <p className="info-value">
                  {product.quantity}
                </p>

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="description-section">

              <h3 className="description-heading">
                DESCRIPTION
              </h3>

              <p className="product-description">
                {product.description}
              </p>

            </div>

            {/* BUTTONS */}
            <div className="product-buttons">

              {/* BUY NOW */}
              <button
                className="buy-btn"
                onClick={() =>
                  setShowOrderForm(true)
                }
              >
                BUY NOW
              </button>

              {/* CHAT */}
              <button
                className="chat-btn"
                onClick={
                  HandleSellerChat
                }
              >
                CHAT WITH SELLER
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  };

  export default ProductDetails;