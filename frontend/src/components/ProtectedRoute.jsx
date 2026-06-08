import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { loading, isAuthenticated, token, user } = useContext(AuthContext);

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace />;
}

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #ecf0f1",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
};
