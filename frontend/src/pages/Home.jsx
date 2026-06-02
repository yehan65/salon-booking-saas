import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export default function Home() {
  const { isAuthenticated, user } = useContext(AuthContext);

  // If logged in as admin
  if (isAuthenticated && user?.role === "admin") {
    return <AdminHome />;
  }

  // If logged in as customer
  if (isAuthenticated && user?.role === "customer") {
    return <CustomerHome />;
  }

  // If not logged in
  return <GuestHome />;
}

function AdminHome() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome back! Manage your salon from here.</p>

      <div style={styles.statsGrid}>
        <Link to="/admin/bookings" style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <h3>Manage Bookings</h3>
          <p>View all customer appointments</p>
        </Link>

        <Link to="/admin/services" style={styles.statCard}>
          <div style={styles.statIcon}>💇</div>
          <h3>Manage Services</h3>
          <p>Add or edit salon services</p>
        </Link>

        <Link to="/admin/staff" style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <h3>Manage Staff</h3>
          <p>Manage staff schedules</p>
        </Link>

        <Link to="/admin/dashboard" style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <h3>Analytics</h3>
          <p>View revenue and stats</p>
        </Link>
      </div>
    </div>
  );
}

// Customer Homepage
function CustomerHome() {
  const { user } = useContext(AuthContext);

  return (
    <div style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.title}>Welcome back, {user?.name}! 👋</h1>
        <p style={styles.subtitle}>Ready for your next salon visit?</p>
      </div>

      <div style={styles.statsGrid}>
        <Link to="/services" style={styles.statCard}>
          <div style={styles.statIcon}>💇</div>
          <h3>Book Now</h3>
          <p>Schedule your next appointment</p>
        </Link>

        <Link to="/my-bookings" style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <h3>My Bookings</h3>
          <p>View upcoming appointments</p>
        </Link>
      </div>

      {/* Featured Services Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Popular Services</h2>
        <div style={styles.servicesGrid}>
          <div style={styles.serviceCard}>
            <h3>✂️ Haircut</h3>
            <p>Professional cut and style</p>
            <small>30 min - Starting at $45</small>
          </div>
          <div style={styles.serviceCard}>
            <h3>🎨 Hair Color</h3>
            <p>Full color or highlights</p>
            <small>90 min - Starting at $120</small>
          </div>
          <div style={styles.serviceCard}>
            <h3>💆 Massage</h3>
            <p>Relaxing full body massage</p>
            <small>60 min - Starting at $80</small>
          </div>
        </div>
      </div>
    </div>
  );
}

// Guest Homepage (Not logged in)
function GuestHome() {
  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Welcome to SalonBooking</h1>
        <p style={styles.heroSubtitle}>Book your next appointment with ease</p>
        <div style={styles.buttonGroup}>
          <Link to="/register" style={styles.primaryBtn}>
            Get Started
          </Link>
          <Link to="/login" style={styles.secondaryBtn}>
            Login
          </Link>
        </div>
      </div>

      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📅</div>
            <h3>Easy Booking</h3>
            <p>Book appointments 24/7</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👥</div>
            <h3>Expert Staff</h3>
            <p>Professional stylists</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💳</div>
            <h3>Secure Payments</h3>
            <p>Safe and easy checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  subtitle: {
    color: "#7f8c8d",
    marginBottom: "2rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    textDecoration: "none",
    color: "#2c3e50",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  statIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  welcomeSection: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  section: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  serviceCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heroSection: {
    textAlign: "center",
    padding: "3rem 1rem",
    backgroundColor: "#3498db",
    borderRadius: "8px",
    color: "white",
    marginBottom: "3rem",
  },
  heroTitle: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "white",
    color: "#3498db",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  secondaryBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    border: "1px solid white",
  },
  featuresSection: {
    textAlign: "center",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  },
  featureCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
};
