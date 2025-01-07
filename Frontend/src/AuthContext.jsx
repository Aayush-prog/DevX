import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null);
  // Load token from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    if (token) setAuthToken(token);
    if (userRole) setRole(userRole);
  }, []);

  // Function to save token after login
  const login = (token, userRole) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", userRole);
    setAuthToken(token);
    setRole(userRole);
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    setAuthToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
