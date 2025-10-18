import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated,loading } = useAppContext();

  if(loading){
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
