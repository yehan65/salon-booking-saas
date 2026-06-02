// frontend/src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/Auth";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // console.log(user);

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          💇 SalonBooking
        </Link>

        <div style={styles.navLinks}>
          {user.role !== "admin" && (
            <Link to="/services" style={styles.link}>
              Services
            </Link>
          )}

          {isAuthenticated ? (
            user.role === "admin" ? (
              <>
                <Link to="/admin/bookings" style={styles.link}>
                  Manage Bookings
                </Link>
                <Link to="/admin/staff" style={styles.link}>
                  Manage Staff
                </Link>
                <Link to="/admin/services" style={styles.link}>
                  Manage Services
                </Link>
                <span style={styles.userName}>Hi, {user?.name}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/my-bookings" style={styles.link}>
                  My Bookings
                </Link>
                <Link to="/booking" style={styles.link}>
                  Book Now
                </Link>
                <span style={styles.userName}>Hi, {user?.name}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#2c3e50",
    padding: "1rem 2rem",
    color: "white",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logo: {
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  userName: {
    color: "#ecf0f1",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
