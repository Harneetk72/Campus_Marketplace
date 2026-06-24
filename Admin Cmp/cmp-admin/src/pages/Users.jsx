import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
const res = await axios.get(
  "http://localhost:5000/api/auth/all-users",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  }
);

      setUsers(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <h2>Loading Users...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="users-container">
      <h2>All Users</h2>

      {users.length === 0 ? (
        <p>No Users Found</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  {user.college?.collegeName ||
                    "Not Assigned"}
                </td>
                <td>
                  {user.isVerified
                    ? "✅ Verified"
                    : "⏳ Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;