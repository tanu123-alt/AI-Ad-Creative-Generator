import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("app_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("app_user", JSON.stringify(userData));
    sessionStorage.setItem("app_access", "true");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("app_user");
    sessionStorage.removeItem("app_access");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) || {};