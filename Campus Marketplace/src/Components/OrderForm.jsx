import React, { useState } from "react";
import apiClient from "../api/apiClient";

const OrderForm = ({
  productId,
  onClose,
}) => {

  const [formData, setFormData] =
    useState({

      fullName: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",

    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleOrder =
    async () => {

      try {

        const response =
          await apiClient.post(
            "/order/create",
            {

              productId,

              ...formData,

            }
          );

        alert(
          response.data.message
        );

        onClose();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="order-overlay">

      <div className="order-modal">

        <div className="order-header">

          <h2>
            Place Order
          </h2>

          <button
            onClick={onClose}
          >
            X
          </button>

        </div>

        <div className="order-form">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
          />

          <button
            className="place-order-btn"
            onClick={handleOrder}
          >
            Place Order
          </button>

        </div>

      </div>

    </div>

  );

};

export default OrderForm;