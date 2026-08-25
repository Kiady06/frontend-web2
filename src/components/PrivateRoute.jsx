import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === "admin" && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === "student" && isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;