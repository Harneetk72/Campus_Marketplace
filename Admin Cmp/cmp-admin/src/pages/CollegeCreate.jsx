import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCollege() {
  const navigate = useNavigate();

  const [collegeName, setCollegeName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/college/create-college",
        {
          collegeName,
          address,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create college"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="college-form-container">
      <h2>Create College</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="College Name"
          value={collegeName}
          onChange={(e) =>
            setCollegeName(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create College"}
        </button>
      </form>
    </div>
  );
}

export default CreateCollege;