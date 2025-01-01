import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

const PrivateRoute = ({ element }) => {
  const { authToken } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  // If user is authenticated, render the requested component
  // If not, redirect to the login page
  return authToken && role ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
