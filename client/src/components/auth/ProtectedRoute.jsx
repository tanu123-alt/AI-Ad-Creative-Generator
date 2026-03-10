import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const hasAccess = sessionStorage.getItem("app_access");
  if (!hasAccess) return <Navigate to="/" replace />;
  return children;
}