import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    images: []   // ✅ fixed
  });

  const [preview, setPreview] = useState([]); // ✅ fixed

  // Handle text inputs
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...previewUrls]);
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("category", product.category);

      // ✅ Multiple images send
      product.images.forEach((img) => {
        formData.append("images", img);
      });

      await apiClient.post("/product/create", formData, {
        withCredentials: true, 
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      alert("Product Created ✅");
navigate("/dashboard");
      // reset form
      setProduct({
        title: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        images: []
      });

      setPreview([]);
      console.log(product);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create-container">

      <div className="create-header">
        <h1>Create Product</h1>
      </div>

      <div className="create-layout">

        {/* LEFT */}
        <div className="left-section">

          <div className="card">
            <h3>General Information</h3>

            <label>Product Title</label>
            <input 
              type="text"
              name="title"
              placeholder="Enter product name"
              value={product.title}
              onChange={handleChange}
            />

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={product.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="card">
            <h3>Product Images</h3>

            {/* Hidden Input */}
            <input
              type="file"
              multiple
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            {/* Upload Box */}
            <label htmlFor="fileInput" className="upload-box">
              +
            </label>

            {/* Preview */}
            {preview.length > 0 && (
              <div style={{
                marginTop: "10px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}>
                {preview.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    width="100"
                    style={{ borderRadius: "8px" }}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="right-section">

          <div className="card">
            <h3>Product Details</h3>

            <label>Price</label>
            <input
              type="number"
              name="price"
              placeholder="₹"
              value={product.price}
              onChange={handleChange}
            />

            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="0"
              value={product.quantity}
              onChange={handleChange}
            />

            <label>Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>

          <div className="card">
            <button className="submit-btn" onClick={handleSubmit}>
              Create Product
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CreateProduct;