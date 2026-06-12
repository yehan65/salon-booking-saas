// frontend/src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/Auth";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  // return (
  // <nav style={styles.navbar}>
  //   <div style={styles.container}>
  //     <Link to="/" style={styles.logo}>
  //       💇 SalonBooking
  //     </Link>

  //     <div
  //       className="hambuger-icon"
  //       onClick={() => setIsMenuOpen(!isMenuOpen)}
  //     >
  //       {isMenuOpen ? "✕" : "☰"}
  //     </div>

  //     <div
  //       style={{
  //         ...styles.navLinks,
  //         ...(isMenuOpen ? styles.navLinksOpen : {}),
  //       }}
  //     >
  //       {user.role !== "admin" && (
  //         <Link to="/services" style={styles.link}>
  //           Services
  //         </Link>
  //       )}

  //       {isAuthenticated ? (
  //         user.role === "admin" ? (
  //           <>
  //             <Link
  //               to="/admin/bookings"
  //               style={styles.link}
  //               onClick={closeMenu}
  //             >
  //               Manage Bookings
  //             </Link>
  //             <Link to="/admin/staff" style={styles.link} onClick={closeMenu}>
  //               Manage Staff
  //             </Link>
  //             <Link
  //               to="/admin/services"
  //               style={styles.link}
  //               onClick={closeMenu}
  //             >
  //               Manage Services
  //             </Link>
  //             <span style={styles.userName}>Hi, {user?.name}</span>
  //             <button onClick={handleLogout} style={styles.logoutBtn}>
  //               Logout
  //             </button>
  //           </>
  //         ) : (
  //           <>
  //             <Link to="/my-bookings" style={styles.link} onClick={closeMenu}>
  //               My Bookings
  //             </Link>
  //             <Link to="/booking" style={styles.link} onClick={closeMenu}>
  //               Book Now
  //             </Link>
  //             <span style={styles.userName}>Hi, {user?.name}</span>
  //             <button onClick={handleLogout} style={styles.logoutBtn}>
  //               Logout
  //             </button>
  //           </>
  //         )
  //       ) : (
  //         <>
  //           <Link to="/login" style={styles.link} onClick={closeMenu}>
  //             Login
  //           </Link>
  //           <Link to="/register" style={styles.link} onClick={closeMenu}>
  //             Register
  //           </Link>
  //         </>
  //       )}
  //     </div>
  //   </div>
  // </nav>
  // );
  return (
    <>
      {/* CSS for responsive design */}
      <style>{`
       * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Navbar base styles */
        .navbar {
          background-color: #2c3e50;
          padding: 1rem 2rem;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          z-index: 1001;
        }

        /* Desktop navigation */
        .desktop-nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .desktop-nav a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
        }

        .desktop-nav span {
          color: #ecf0f1;
        }

        .logout-btn {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        /* Hamburger button */
        .hamburger {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          z-index: 1001;
        }

        /* Mobile navigation - slide from right */
        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: 70%;
          max-width: 300px;
          height: 100vh;
          background-color: #2c3e50;
          flex-direction: column;
          padding: 5rem 1.5rem 2rem;
          gap: 1.5rem;
          transition: right 0.3s ease;
          z-index: 1000;
          box-shadow: -2px 0 10px rgba(0,0,0,0.2);
        }

        .mobile-nav.open {
          right: 0;
        }

        .mobile-nav a {
          color: white;
          text-decoration: none;
          font-size: 1.1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: block;
        }

        .mobile-nav span {
          color: #ecf0f1;
          padding: 0.75rem 0;
          display: block;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .mobile-nav .logout-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.75rem;
        }

        /* Overlay when menu is open */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 999;
          display: none;
        }

        .menu-overlay.open {
          display: block;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .hamburger {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .mobile-nav,
          .menu-overlay {
            display: none !important;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            💇 SalonBooking
          </Link>

          {/* Hamburger Icon - mobile only */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {renderNavLinks(
              user,
              isAuthenticated,
              handleLogout,
              closeMenu,
              "desktop",
            )}
          </div>

          {/* Overlay */}
          <div
            className={`menu-overlay ${isMenuOpen ? "open" : ""}`}
            onClick={closeMenu}
          />

          {/* Mobile Menu Overlay */}

          <div
            className={`mobile-nav ${isMenuOpen ? "open" : ""}`}
            //  onClick={closeMenu}
          >
            {renderNavLinks(
              user,
              isAuthenticated,
              handleLogout,
              closeMenu,
              "mobile",
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

// Helper function to render navigation links
const renderNavLinks = (
  user,
  isAuthenticated,
  handleLogout,
  closeMenu,
  type,
) => (
  <>
    {user?.role !== "admin" && (
      <Link to="/services" onClick={closeMenu}>
        Services
      </Link>
    )}

    {isAuthenticated ? (
      user?.role === "admin" ? (
        <>
          <Link to="/admin/bookings" onClick={closeMenu}>
            Manage Bookings
          </Link>
          <Link to="/admin/staff" onClick={closeMenu}>
            Manage Staff
          </Link>
          <Link to="/admin/services" onClick={closeMenu}>
            Manage Services
          </Link>
          <span>Hi, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/my-bookings" onClick={closeMenu}>
            My Bookings
          </Link>
          <Link to="/booking" onClick={closeMenu}>
            Book Now
          </Link>
          <span>Hi, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      )
    ) : (
      <>
        <Link to="/login" onClick={closeMenu}>
          Login
        </Link>
        <Link to="/register" onClick={closeMenu}>
          Register
        </Link>
      </>
    )}
  </>
);

// const styles = {
//   navbar: {
//     backgroundColor: "#2c3e50",
//     padding: "1rem 2rem",
//     color: "white",
//     position: "sticky",
//     top: 0,
//     zIndex: 1000,
//   },
//   container: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     maxWidth: "1200px",
//     margin: "0 auto",
//     position: "relative",
//   },
//   logo: {
//     color: "white",
//     fontSize: "1.5rem",
//     fontWeight: "bold",
//     textDecoration: "none",
//     zIndex: 1001,
//   },

//   navLinks: {
//     display: "flex",
//     gap: "1.5rem",
//     alignItems: "center",
//   },

//   link: {
//     color: "white",
//     textDecoration: "none",
//     fontSize: "1rem",
//     padding: "0.5rem 0",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//   },
//   userName: {
//     color: "#ecf0f1",
//     padding: "0.5rem 0",
//   },
//   logoutBtn: {
//     backgroundColor: "#e74c3c",
//     color: "white",
//     border: "none",
//     padding: "0.25rem 0.75rem",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     marginTop: "0.5rem",
//   },
// };
