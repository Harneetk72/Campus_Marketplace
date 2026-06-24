import React, { useState } from "react";
import Lottie from "lottie-react";
import signinanimation from "../assets/signin.json";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.log("Login Error:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <Lottie animationData={signinanimation} loop />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Sign In</h2>

          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link">
              Sign Up
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;