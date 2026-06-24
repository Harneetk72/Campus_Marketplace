import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/auth/pending-users",
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
          "Failed to load pending users"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

     await axios.post(
  `http://localhost:5000/api/auth/is-verified/${id}`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  }
);
      fetchPendingUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Verification Failed"
      );
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="pending-users">
      <h2>Pending Users</h2>

      {users.length === 0 ? (
        <p>No Pending Users Found</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
               <td>
  {user.college?.collegeName || "Not Assigned"}
</td>
                <td>
                  <button
                    onClick={() =>
                      verifyUser(user._id)
                    }
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingUsers;