import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
