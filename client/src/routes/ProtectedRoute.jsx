import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";
import { getToken } from "../utils/storage";

/** Requires a valid admin session: JWT in localStorage (`adminToken`) and successful `/admin/auth/me`. */
const ProtectedRoute = ({ auth }) => {
  if (auth.loading) {
    return <Loader label="Checking admin session..." />;
  }

  if (!getToken() || !auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

