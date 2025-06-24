import { createContext, useContext, useState } from "react";
import { apiService } from "../services/apiServices";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      setUser(response);
      // ✅ Now check auth after successful login
      const userData = await apiService.checkAuth();
      console.log("User data after login:", userData);
      setUser(userData);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
  };
  const checkAuth = async () => {
    try {
      const userData = await apiService.checkAuth();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Auth check failed", err);
      setUser(null);
      throw err;
    }
  };
  const register = async (userData) => {
    await apiService.register(userData);
    // Optionally login automatically after register
    return await login(userData.email, userData.password);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loading, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
