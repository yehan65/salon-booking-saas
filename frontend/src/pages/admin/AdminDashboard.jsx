import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const response = await api.get("/admin/dashboard/stats");
      setStats(response.data.data);
      setTodayBookings(response.data.data.upcoming || []);
      setPopularServices(response.data.data.popularServices || []);
      setUpcoming(response.data.data.upcoming || []);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to load stats!");
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#2ecc71";
      case "pending":
        return "#f39c12";
      case "cancelled":
        return "#e74c3c";
      case "completed":
        return "#3498db";
      default:
        return "#95a5a6";
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>
        Welcome back! Here's what's happening at your salon.
      </p>

      {/* Period Selector */}
      <div style={styles.periodSelector}>
        <button
          style={{
            ...styles.periodBtn,
            backgroundColor: selectedPeriod === "week" ? "#3498db" : "#ecf0f1",
            color: selectedPeriod === "week" ? "white" : "#333",
          }}
          onClick={() => setSelectedPeriod("week")}
        >
          This Week
        </button>
        <button
          style={{
            ...styles.periodBtn,
            backgroundColor: selectedPeriod === "month" ? "#3498db" : "#ecf0f1",
            color: selectedPeriod === "month" ? "white" : "#333",
          }}
          onClick={() => setSelectedPeriod("month")}
        >
          This Month
        </button>
        <button
          style={{
            ...styles.periodBtn,
            backgroundColor: selectedPeriod === "year" ? "#3498db" : "#ecf0f1",
            color: selectedPeriod === "year" ? "white" : "#333",
          }}
          onClick={() => setSelectedPeriod("year")}
        >
          This Year
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div
          style={{
            ...styles.statCard,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <h3>Total Revenue</h3>
            <p style={styles.statValue}>${stats?.week?.revenue || 0}</p>
            <p style={styles.statChange}>+12% from last week</p>
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          }}
        >
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statInfo}>
            <h3>Total Bookings</h3>
            <p style={styles.statValue}>{stats?.week?.bookings || 0}</p>
            <p style={styles.statChange}>+8% from last week</p>
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        >
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statInfo}>
            <h3>Active Customers</h3>
            <p style={styles.statValue}>156</p>
            <p style={styles.statChange}>+5 new this week</p>
          </div>
        </div>

        <div
          style={{
            ...styles.statCard,
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          }}
        >
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statInfo}>
            <h3>Avg. Rating</h3>
            <p style={styles.statValue}>4.8</p>
            <p style={styles.statChange}>Based on 128 reviews</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={styles.twoColumn}>
        {/* Left Column - Today's Appointments */}
        <div style={styles.appointmentsSection}>
          <div style={styles.sectionHeader}>
            <h2>Today's Appointments</h2>
            <Link to="/admin/bookings" style={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {todayBookings.length === 0 ? (
            <p style={styles.emptyMessage}>
              No appointments scheduled for today.
            </p>
          ) : (
            <div style={styles.appointmentsList}>
              {todayBookings.map((booking) => (
                <div key={booking._id} style={styles.appointmentCard}>
                  <div style={styles.appointmentTime}>
                    {new Date(booking.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div style={styles.appointmentInfo}>
                    <div style={styles.customerName}>
                      {booking.customerId?.name}
                    </div>
                    <div style={styles.serviceName}>
                      {booking.serviceId?.name}
                    </div>
                    <div style={styles.staffName}>
                      with {booking.staffId?.name}
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.status,
                      backgroundColor: getStatusColor(booking.status),
                    }}
                  >
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Popular Services */}
        <div style={styles.popularSection}>
          <div style={styles.sectionHeader}>
            <h2>Popular Services</h2>
          </div>

          {popularServices.length === 0 ? (
            <p style={styles.emptyMessage}>No service data available.</p>
          ) : (
            <div style={styles.popularList}>
              {popularServices.map((service, index) => (
                <div key={index} style={styles.popularItem}>
                  <div style={styles.popularRank}>#{index + 1}</div>
                  <div style={styles.popularInfo}>
                    <div style={styles.popularName}>{service.name}</div>
                    <div style={styles.popularStats}>
                      {service.bookings} bookings • ${service.revenue} revenue
                    </div>
                  </div>
                  <div style={styles.popularPercentage}>
                    {Math.round(
                      (service.bookings / stats?.week?.bookings) * 100,
                    )}
                    %
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <Link to="/admin/bookings" style={styles.actionCard}>
            <div>📅</div>
            <h4>View All Bookings</h4>
          </Link>
          <Link to="/admin/services" style={styles.actionCard}>
            <div>💇</div>
            <h4>Add New Service</h4>
          </Link>
          <Link to="/admin/staff" style={styles.actionCard}>
            <div>👥</div>
            <h4>Add Staff Member</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
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
  periodSelector: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  periodBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem",
    borderRadius: "12px",
    color: "white",
    gap: "1rem",
  },
  statIcon: {
    fontSize: "2.5rem",
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    margin: "0.25rem 0",
  },
  statChange: {
    fontSize: "0.75rem",
    opacity: 0.9,
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  appointmentsSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  popularSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #ecf0f1",
  },
  viewAllLink: {
    color: "#3498db",
    textDecoration: "none",
  },
  appointmentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  appointmentCard: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    gap: "1rem",
  },
  appointmentTime: {
    fontWeight: "bold",
    color: "#3498db",
    minWidth: "70px",
  },
  appointmentInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: "bold",
  },
  serviceName: {
    fontSize: "0.85rem",
    color: "#7f8c8d",
  },
  staffName: {
    fontSize: "0.75rem",
    color: "#95a5a6",
  },
  status: {
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    color: "white",
  },
  popularList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  popularItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    gap: "1rem",
  },
  popularRank: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#3498db",
    minWidth: "40px",
  },
  popularInfo: {
    flex: 1,
  },
  popularName: {
    fontWeight: "bold",
  },
  popularStats: {
    fontSize: "0.75rem",
    color: "#7f8c8d",
  },
  popularPercentage: {
    fontWeight: "bold",
    color: "#2ecc71",
  },
  quickActions: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#2c3e50",
    transition: "transform 0.3s",
  },
  emptyMessage: {
    textAlign: "center",
    padding: "2rem",
    color: "#95a5a6",
  },
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
