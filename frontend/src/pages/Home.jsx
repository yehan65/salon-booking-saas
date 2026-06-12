import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import api from "../services/api";
import toast from "react-hot-toast";

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
  const [hoveredCard, setHoveredCard] = useState(null);
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome Admin!</h1>
      <p style={styles.subtitle}>Welcome back! Manage your salon from here.</p>

      <div style={styles.statsGrid}>
        <Link
          to="/admin/bookings"
          style={{
            ...styles.statCard,
            ...(hoveredCard === "bookings" ? styles.statCardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard("bookings")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.statIcon}>📅</div>
          <h3>Manage Bookings</h3>
          <p>View all customer appointments</p>
        </Link>

        <Link
          to="/admin/services"
          style={{
            ...styles.statCard,
            ...(hoveredCard === "services" ? styles.statCardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard("services")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.statIcon}>💇</div>
          <h3>Manage Services</h3>
          <p>Add or edit salon services</p>
        </Link>

        <Link
          to="/admin/staff"
          style={{
            ...styles.statCard,
            ...(hoveredCard === "staff" ? styles.statCardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard("staff")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.statIcon}>👥</div>
          <h3>Manage Staff</h3>
          <p>Manage staff schedules</p>
        </Link>

        <Link
          to="/admin/dashboard"
          style={{
            ...styles.statCard,
            ...(hoveredCard === "analytics" ? styles.statCardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard("analytics")}
          onMouseLeave={() => setHoveredCard(null)}
        >
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
  const [popularServices, setPopularServices] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularServices();
  }, []);

  async function fetchPopularServices() {
    try {
      const response = await api.get("/user/services/popular");
      setPopularServices(response.data?.data);
    } catch (error) {
      console.error(error.message);
      toast.error("Cannot display popular services at the moment!");
    }
  }

  function displayEmoji(category, keyword) {
    const safetyCategory = category || "";
    const safeKeyword = (keyword || "").toLowerCase();
    switch (true) {
      case safetyCategory === "Hair":
        return "✂️";
      case safetyCategory === "Nails":
        return "💅";
      case safetyCategory === "Massage" && safeKeyword.includes("women"):
        return "💆‍♀️";
      case safetyCategory === "Massage" && safeKeyword.includes("men"):
        return "💆‍♂️";
      case safetyCategory === "Facial":
        return "🧴😀";
      case safetyCategory === "Makeup":
        return "💄";
      case safetyCategory === "Waxing":
        return "🪒";
      case safetyCategory === "Hair Color":
        return "🎨";
      default:
        return "📃";
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.title}>Welcome back, {user?.name}! 👋</h1>
        <p style={styles.subtitle}>Ready for your next salon visit?</p>
      </div>

      <div style={styles.statsGrid}>
        <Link
          to="/services"
          style={{
            ...styles.statCard,
            ...(hoveredCard === "book" ? styles.statCardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard("book")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.statIcon}>💇</div>
          <h3>Book Now</h3>
          <p>Schedule your next appointment</p>
        </Link>

        <Link
          to="/my-bookings"
          style={{
            ...styles.statCard,
            ...(hoveredCard === "mybookings" ? styles.statCardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard("mybookings")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.statIcon}>📅</div>
          <h3>My Bookings</h3>
          <p>View upcoming appointments</p>
        </Link>
      </div>

      {/* Featured Services Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Popular Services</h2>
        <div style={styles.servicesGrid}>
          {popularServices.map((service) => {
            return (
              <div
                key={service._id}
                style={{
                  ...styles.serviceCard,
                  ...(hoveredCard === service._id ? styles.statCardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(service._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/booking/${service._id}`)}
              >
                <h3>
                  {displayEmoji(service.category, service.name)} {service.name}
                </h3>
                <p>{service.description}</p>
                <small>
                  {service.duration} min - Starting at ${service.price}
                </small>
              </div>
            );
          })}
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

// const styles = {
//   container: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "2rem",
//   },
//   title: {
//     fontSize: "2rem",
//     marginBottom: "0.5rem",
//     color: "#2c3e50",
//   },
//   subtitle: {
//     color: "#7f8c8d",
//     marginBottom: "2rem",
//   },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//     marginBottom: "2rem",
//   },
//   statCard: {
//     backgroundColor: "white",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     textAlign: "center",
//     textDecoration: "none",
//     color: "#2c3e50",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     transition: "transform 0.3s",
//   },
//   statIcon: {
//     fontSize: "3rem",
//     marginBottom: "1rem",
//   },
//   welcomeSection: {
//     textAlign: "center",
//     marginBottom: "3rem",
//   },
//   section: {
//     marginTop: "2rem",
//   },
//   sectionTitle: {
//     fontSize: "1.5rem",
//     marginBottom: "1rem",
//     color: "#2c3e50",
//   },
//   servicesGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//   },
//   serviceCard: {
//     backgroundColor: "white",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   },
//   heroSection: {
//     textAlign: "center",
//     padding: "3rem 1rem",
//     backgroundColor: "#3498db",
//     borderRadius: "8px",
//     color: "white",
//     marginBottom: "3rem",
//   },
//   heroTitle: {
//     fontSize: "2.5rem",
//     marginBottom: "1rem",
//   },
//   heroSubtitle: {
//     fontSize: "1.2rem",
//     marginBottom: "2rem",
//   },
//   buttonGroup: {
//     display: "flex",
//     gap: "1rem",
//     justifyContent: "center",
//   },
//   primaryBtn: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "white",
//     color: "#3498db",
//     textDecoration: "none",
//     borderRadius: "5px",
//     fontWeight: "bold",
//   },
//   secondaryBtn: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "transparent",
//     color: "white",
//     textDecoration: "none",
//     borderRadius: "5px",
//     border: "1px solid white",
//   },
//   featuresSection: {
//     textAlign: "center",
//   },
//   featuresGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//     marginTop: "2rem",
//   },
//   featureCard: {
//     backgroundColor: "white",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   },
//   featureIcon: {
//     fontSize: "2.5rem",
//     marginBottom: "0.5rem",
//   },
// };

// const styles = {
//   container: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "2rem",
//   },
//   title: {
//     fontSize: "2rem",
//     marginBottom: "0.5rem",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     backgroundClip: "text",
//     WebkitBackgroundClip: "text",
//     color: "transparent",
//   },
//   subtitle: {
//     color: "#7f8c8d",
//     marginBottom: "2rem",
//   },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//     marginBottom: "2rem",
//   },
//   statCard: {
//     background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
//     padding: "1.5rem",
//     borderRadius: "16px",
//     textAlign: "center",
//     textDecoration: "none",
//     color: "#2c3e50",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//     transition: "transform 0.3s, box-shadow 0.3s",
//     border: "1px solid rgba(0,0,0,0.05)",
//     cursor: "pointer",
//     display: "block",
//   },
//   statCardHover: {
//     transform: "translateY(-5px)",
//     boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
//   },
//   statIcon: {
//     fontSize: "3rem",
//     marginBottom: "1rem",
//   },
//   welcomeSection: {
//     textAlign: "center",
//     marginBottom: "3rem",
//   },
//   section: {
//     marginTop: "2rem",
//   },
//   sectionTitle: {
//     fontSize: "1.5rem",
//     marginBottom: "1rem",
//     color: "#2c3e50",
//     position: "relative",
//     display: "inline-block",
//     "&:after": {
//       content: "''",
//       position: "absolute",
//       bottom: "-8px",
//       left: "0",
//       width: "50%",
//       height: "3px",
//       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       borderRadius: "2px",
//     },
//   },
//   servicesGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//   },
//   serviceCard: {
//     background: "white",
//     padding: "1.5rem",
//     borderRadius: "16px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//     transition: "transform 0.3s",
//     textAlign: "center",
//     "&:hover": {
//       transform: "translateY(-5px)",
//     },
//   },
//   heroSection: {
//     textAlign: "center",
//     padding: "4rem 2rem",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     borderRadius: "24px",
//     color: "white",
//     marginBottom: "3rem",
//     boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//   },
//   heroTitle: {
//     fontSize: "3rem",
//     marginBottom: "1rem",
//   },
//   heroSubtitle: {
//     fontSize: "1.2rem",
//     marginBottom: "2rem",
//     opacity: 0.9,
//   },
//   buttonGroup: {
//     display: "flex",
//     gap: "1rem",
//     justifyContent: "center",
//   },
//   primaryBtn: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "white",
//     color: "#667eea",
//     textDecoration: "none",
//     borderRadius: "50px",
//     fontWeight: "bold",
//     transition: "transform 0.3s, box-shadow 0.3s",
//     display: "inline-block",
//     "&:hover": {
//       transform: "translateY(-2px)",
//       boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
//     },
//   },
//   secondaryBtn: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "transparent",
//     color: "white",
//     textDecoration: "none",
//     borderRadius: "50px",
//     border: "2px solid white",
//     fontWeight: "bold",
//     transition: "all 0.3s",
//     display: "inline-block",
//     "&:hover": {
//       backgroundColor: "white",
//       color: "#667eea",
//     },
//   },
//   featuresSection: {
//     textAlign: "center",
//     marginTop: "3rem",
//   },
//   featuresGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//     marginTop: "2rem",
//   },
//   featureCard: {
//     background: "white",
//     padding: "1.5rem",
//     borderRadius: "16px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//     transition: "transform 0.3s",
//     textAlign: "center",
//     "&:hover": {
//       transform: "translateY(-5px)",
//     },
//   },
//   featureIcon: {
//     fontSize: "2.5rem",
//     marginBottom: "0.5rem",
//   },
// };

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    // background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    // color: "#2c3e50",
    color: "transparent",
    padding: "10px",
    borderRadius: "8px",
  },
  subtitle: {
    color: "#a0a0a0",
    marginBottom: "2rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)",
    padding: "1.5rem",
    borderRadius: "16px",
    textAlign: "center",
    textDecoration: "none",
    color: "#ffffff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    display: "block",
  },
  statCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
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
    color: "dodgerblue",
    position: "relative",
    display: "inline-block",
    "&:after": {
      content: "''",
      position: "absolute",
      bottom: "-8px",
      left: "0",
      width: "50%",
      height: "3px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "2px",
    },
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  serviceCard: {
    background: "linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    transition: "transform 0.3s",
    textAlign: "center",
    color: "#ffffff",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  heroSection: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    borderRadius: "24px",
    color: "white",
    marginBottom: "3rem",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  heroTitle: {
    fontSize: "3rem",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    opacity: 0.8,
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    transition: "transform 0.3s, box-shadow 0.3s",
    display: "inline-block",
    border: "none",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    },
  },
  secondaryBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    border: "2px solid #667eea",
    fontWeight: "bold",
    transition: "all 0.3s",
    display: "inline-block",
    "&:hover": {
      backgroundColor: "white",
      color: "#667eea",
    },
  },
  featuresSection: {
    textAlign: "center",
    marginTop: "3rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  },
  featureCard: {
    background: "linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)",
    padding: "1.5rem",
    borderRadius: "16px",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.1)",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
};
