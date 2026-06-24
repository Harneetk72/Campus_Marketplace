import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { useTheme } from "@mui/material/styles";
import signinanimation from "../assets/signin.json";
import apiClient from "../api/ApiClient";
import { Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigation = useNavigate();
  const [college, setcollege] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    college: "",
  });
  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const FetchColleges = async () => {
      try {
        const res = await apiClient.get("/college/get-colleges");
        console.log("DATA:", res.data);
        console.log("TYPE:", typeof res.data);
        setcollege(res.data.colleges || res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    FetchColleges();
  }, []);
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response= await apiClient.post("auth/signup", {
  userName: formData.username,
  email: formData.email,
  password: formData.password,
  college: formData.college,
});

      console.log("Response:", response);
      toast.success("Signup successful!");
      navigation("/signin");
    } catch (error) {
      console.error("Error signup:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <Lottie animationData={signinanimation} loop={true} />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Sign Up</h2>
          <p>
            Already have an account?{" "}
            <Link to="/Signin" className="link">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label>College</label>
            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Select College"
            >
              <option value="">Select College</option>
              {college?.map((clg) => (
                <option key={clg._id} value={clg._id}>
                  {clg.collegeName}
                </option>
              ))}
            </select>

            <button type="submit">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
