import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // LOGIN
      const res = await axios.post(
        "http://localhost:5000/api/auth/signin",
        
        formData,
        {
          withCredentials: true,
        }
      );

      // Save logged in admin
      localStorage.setItem("token", res.data.token);

setUser(res.data.user);

console.log("TOKEN SAVED:", res.data.token);

      // Check if college exists
      const statsRes = await axios.get(
        "http://localhost:5000/api/auth/dashboard-stats",
        {
          withCredentials: true,
        }
      );

      const stats = statsRes.data;

      console.log("STATS:", stats);

      if (stats.collegeCreated === false) {
        navigate("/create-college");
      } else {
       navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      console.log("FULL ERROR:", err.response);

      setError(
        err.response?.data?.message ||
        "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-navbar">
        <h2>Campus Marketplace Admin</h2>
      </div>

      <div className="login-container">
        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <h2>Welcome Back 👋</h2>

          <p className="subtitle">
            Login to manage colleges, users and approvals
          </p>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

         <div className="admin-info-box">
  <p>
    <strong>New User?</strong>
  </p>
  <p>
    If you are a new HOD/Admin and don't have login credentials,
    please contact the Super Admin.
  </p>
  <p>
    📧 Email: <strong>superadmin@campusmarketplace.com</strong>
  </p>
  <p>
    Request your username and password to access the admin portal.
  </p>
</div>
        </form>
      </div>
    </>
  );
}

export default AdminLogin;