  import { createContext, useContext, useEffect, useState } from "react";
  import apiClient from "../api/apiClient";

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await apiClient.get("/auth/get-user");

      // 🚫 Admin ko user website par login mat hone do
      if (response.data.role === "admin") {
        setUser(null);

        await apiClient.post("/auth/signout");

        return;
      }

      setUser(response.data);

    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (credentials) => {
    const res = await apiClient.post(
      "/auth/signin",
      credentials
    );

    const userRes = await apiClient.get(
      "/auth/get-user"
    );

    if (userRes.data.role !== "user") {
      await apiClient.post("/auth/signout");

      throw new Error(
        "Only users can login here"
      );
    }

    setUser(userRes.data);
  };
    const logout = async () => {
      await apiClient.post("/auth/signout");
      setUser(null);
    };

    useEffect(() => {
      checkAuth();
    }, []);

    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          logout,
          checkAuth,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => {
    return useContext(AuthContext);
  };