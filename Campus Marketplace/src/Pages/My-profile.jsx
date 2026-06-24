import React from "react";
import { useAuth } from "../Context/AuthContext";

const Profile = () => {

  const { user, logout } = useAuth();

  const handleLogout = async () => {

    try {

      await logout();

      window.location.href = "/signin";

    } catch (error) {

      console.log("Logout Error:", error);

    }

  };

  if (!user) {

    return (
      <div className="loading-container">
        <h2>Loading...</h2>
      </div>
    );

  }

  return (

    <div className="profile-page">

      {/* HEADER */}
      <header className="topbar">

        <div className="logo-section">

          <div className="logo-box">
            C
          </div>

          <h2>
            CampusMarket
          </h2>

        </div>

        <div className="nav-right">

          <button className="notification-btn">
            🔔
          </button>

          <div className="user-chip">

            <span>
              {user.userName}
            </span>

          </div>

        </div>

      </header>

      {/* MAIN CONTENT */}
      <div className="profile-container">

        {/* LEFT SECTION */}
        <div className="profile-sidebar">

          <div className="profile-card">

            <div className="profile-top">

              <div>

                <h1>
                  {user.userName}
                </h1>

                <div className="role-badges">

                  <span>
                    Student
                  </span>

                  <span>
                    {user.role}
                  </span>

                </div>

              </div>

              <button className="settings-btn">
                ⚙️
              </button>

            </div>

            <div className="profile-info">

              <div className="info-item">

                <p className="label">
                  EMAIL
                </p>

                <h4>
                  {user.email}
                </h4>

              </div>

              <div className="info-item">

                <p className="label">
                  COLLEGE
                </p>

                <h4>
                  {user.college?.collegeName}
                </h4>

              </div>

              <div className="info-item">

                <p className="label">
                  MEMBER SINCE
                </p>

                <h4>
                  {new Date(user.createdAt).toDateString()}
                </h4>

              </div>

            </div>

            <div className="profile-buttons">

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="profile-main">

          {/* STATS */}
          <div className="stats-grid">

            <div className="stat-card">

              <p>
                ACTIVE LISTINGS
              </p>

              <h2>
                0
              </h2>

            </div>

            <div className="stat-card">

              <p>
                MEMBER SINCE
              </p>

              <h2>
                {new Date(user.createdAt).toDateString()}
              </h2>

            </div>

          </div>

          {/* ACTIVITY */}
          <div className="activity-card">

            <div className="activity-header">

              <h2>
                Account Overview
              </h2>

            </div>

            <div className="activity-list">

              <div className="activity-item">

                <div>

                  <h4>
                    Account Status
                  </h4>

                  <p>
                    Your account is active
                  </p>

                </div>

                <span>
                  Active
                </span>

              </div>

              <div className="activity-item">

                <div>

                  <h4>
                    User Role
                  </h4>

                  <p>
                    Access level in CampusMarket
                  </p>

                </div>

                <span>
                  {user.role}
                </span>

              </div>

              <div className="activity-item">

                <div>

                  <h4>
                    Verification
                  </h4>

                  <p>
                    Account verification status
                  </p>

                </div>

                <span>
                  {user.isVerified
                    ? "Verified"
                    : "Pending"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Profile;