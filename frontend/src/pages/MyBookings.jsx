import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function MyBookings() {
  const navigate = useNavigate();

  const [myBookings, setMyBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  async function fetchMyBookings(req, res) {
    setLoading(true);
    try {
      const response = await api.get("/bookings/my-bookings");
      setMyBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching my bookings: ", error);
      toast.error("Error fetching the bookings");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully.");
      fetchMyBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  }

  function handleRescheduleBooking(bookingId) {
    navigate(`/bookings/reschedule/${bookingId}`);
  }

  function getStatusColor(status) {
    switch (status) {
      case "confirmed":
        return { bg: "#d4edda", color: "#155724", text: "Confirmed" };
      case "pending":
        return { bg: "#fff3cd", color: "#856404", text: "Pending" };
      case "completed":
        return { bg: "#cce5ff", color: "#004085", text: "Completed" };
      case "cancelled":
        return { bg: "#f8d7da", color: "#721c24", text: "Cancelled" };
      case "no_show":
        return { bg: "#f8d7da", color: "#721c24", text: "No Show" };
      default:
        return { bg: "#e2e3e5", color: "#383d41", text: status };
    }
  }

  function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Filter bookings based on selected tab

  function filterBookings() {
    const now = new Date();

    if (selectedTab === "upcoming") {
      return myBookings.filter(
        (booking) =>
          booking.status !== "completed" &&
          booking.status !== "cancelled" &&
          new Date(booking.date) >= now,
      );
    }

    if (selectedTab === "past") {
      return myBookings.filter(
        (booking) =>
          booking.status === "completed" ||
          booking.status === "no_show" ||
          (new Date(booking.date) < now && booking.status !== "cancelled"),
      );
    }

    if (selectedTab === "cancelled") {
      return myBookings.filter((booking) => booking.status === "cancelled");
    }

    return myBookings;
  }

  const filteredBookings = filterBookings();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bookings</h1>
      <p style={styles.subtitle}>View and manage your appointments</p>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            borderBottom:
              selectedTab === "upcoming"
                ? "3px solid #3498db"
                : "3px solid transparent",
            color: selectedTab === "upcoming" ? "#3498db" : "#7f8c8d",
          }}
          onClick={() => setSelectedTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          style={{
            ...styles.tab,
            borderBottom:
              selectedTab === "past"
                ? "3px solid #3498db"
                : "3px solid transparent",
            color: selectedTab === "past" ? "#3498db" : "#7f8c8d",
          }}
          onClick={() => setSelectedTab("past")}
        >
          Past
        </button>
        <button
          style={{
            ...styles.tab,
            borderBottom:
              selectedTab === "cancelled"
                ? "3px solid #3498db"
                : "3px solid transparent",
            color: selectedTab === "cancelled" ? "#3498db" : "#7f8c8d",
          }}
          onClick={() => setSelectedTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No {selectedTab} bookings found.</p>
          {selectedTab === "upcoming" && (
            <button
              style={styles.bookBtn}
              onClick={() => navigate("/services")}
            >
              Book an Appointment
            </button>
          )}
        </div>
      ) : (
        <div style={styles.bookingsList}>
          {filteredBookings.map((booking) => {
            const statusStyle = getStatusColor(booking.status);
            const isUpcoming =
              booking.status === "confirmed" &&
              new Date(booking.date) >= new Date();

            return (
              <div key={booking._id} style={styles.bookingCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.serviceName}>
                      {booking.serviceId?.name || "Service"}
                    </h3>
                    <p style={styles.staffName}>with {booking.staffId?.name}</p>
                  </div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    {statusStyle.text}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Date:</span>
                    <span style={styles.infoValue}>
                      {formatDate(booking.date)}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Time:</span>
                    <span style={styles.infoValue}>
                      {formatTime(booking.date)}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Duration:</span>
                    <span style={styles.infoValue}>
                      {booking.duration} minutes
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Price:</span>
                    <span style={styles.infoValue}>${booking.totalPrice}</span>
                  </div>
                  {booking.customerNotes && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Notes:</span>
                      <span style={styles.infoValue}>
                        {booking.customerNotes}
                      </span>
                    </div>
                  )}
                </div>

                {isUpcoming && (
                  <div style={styles.cardActions}>
                    <button
                      style={styles.cancelBtn}
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel Booking
                    </button>
                    <button
                      style={styles.rescheduleBtn}
                      onClick={() => handleRescheduleBooking(booking._id)}
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
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
  tabs: {
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem",
    borderBottom: "1px solid #ecf0f1",
  },
  tab: {
    padding: "0.75rem 0",
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #ecf0f1",
  },
  serviceName: {
    fontSize: "1.25rem",
    marginBottom: "0.25rem",
    color: "#2c3e50",
  },
  staffName: {
    color: "#7f8c8d",
    fontSize: "0.9rem",
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  cardBody: {
    marginBottom: "1.25rem",
  },
  infoRow: {
    display: "flex",
    marginBottom: "0.5rem",
  },
  infoLabel: {
    width: "80px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  infoValue: {
    color: "#666",
  },
  cardActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    paddingTop: "1rem",
    borderTop: "1px solid #ecf0f1",
  },
  cancelBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  rescheduleBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
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
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    color: "#7f8c8d",
  },
  bookBtn: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
