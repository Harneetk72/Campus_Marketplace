import React, { useEffect, useState } from "react";
import axios from "axios";
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/auth/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="dash-loading">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="dash-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Top Stats */}
      <div className="card-grid">
        <div className="card">
          <h3>Total Users</h3>
          <p>{data?.totalUsers ?? 0}</p>
        </div>

        <div className="card">
          <h3>Pending Users</h3>
          <p>{data?.pendingUsers ?? 0}</p>
        </div>

        <div className="card">
          <h3>Verified Users</h3>
          <p>{data?.verifiedUsers ?? 0}</p>
        </div>

        <div className="card">
          <h3>College</h3>
          <p>{data?.college?.collegeName || "No College"}</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        <div className="info-card">
          <h3>📈 Quick Stats</h3>
          <ul>
            <li>Total Users: {data?.totalUsers ?? 0}</li>
            <li>Verified Users: {data?.verifiedUsers ?? 0}</li>
            <li>Pending Users: {data?.pendingUsers ?? 0}</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>⚡ System Status</h3>
          <p className="status online">● Online</p>
          <p>All services are running normally.</p>
        </div>

        <div className="info-card">
          <h3>🕒 Recent Activity</h3>
          <p>Latest dashboard data loaded successfully.</p>
          <p>Admin logged in.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;