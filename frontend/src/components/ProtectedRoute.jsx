import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { loading, isAuthenticated, token, user } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace />;
}
