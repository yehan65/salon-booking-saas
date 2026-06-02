import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, today, week, month
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isHoverd, setIsHoverd] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter, statusFilter]);

  async function fetchBookings() {
    setLoading(true);
    let bookingsData;
    try {
      let url = "/admin/bookings";

      if (filter === "today") {
        url = "/admin/bookings/today";
      }

      if (filter === "week") {
        url = "/admin/bookings/week";
      }

      if (filter === "month") {
        url = "/admin/bookings/month";
      }

      const response = await api.get(url);
      bookingsData = response.data.data || [];

      if (statusFilter !== "all") {
        bookingsData = bookingsData.filter(
          (booking) => booking.status === statusFilter,
        );
      }

      // console.log("bookings data: ", bookingsData);

      setBookings(bookingsData);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  // console.log(bookings);
  // console.log(statusFilter);

  async function handleUpdateStatus(bookingId, newStatus) {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      toast.success(`Booking marked as ${newStatus}`);
      fetchBookings();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
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

  function getStatusOptions(currentStatus) {
    let options = [
      { value: "confirmed", label: "Confirm" },
      { value: "completed", label: "Mark Completed" },
      { value: "cancelled", label: "Cancel" },
      { value: "no_show", label: "Mark as No Show" },
    ];

    return options.filter((option) => option.value !== currentStatus);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function calculateTotals() {
    const totalRevenue = bookings
      .filter((booking) => booking.status === "completed")
      .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    const totalBookings = bookings.length;
    const confirmedCount = bookings.filter(
      (b) => b.status === "confirmed",
    ).length;
    const completedCount = bookings.filter(
      (b) => b.status === "completed",
    ).length;
    const cancelledCount = bookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    return {
      totalRevenue,
      totalBookings,
      confirmedCount,
      completedCount,
      cancelledCount,
    };
  }

  const total = calculateTotals();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Bookings</h1>
      <p style={styles.subtitle}>View and manage all customer appointments</p>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h3>Total Bookings</h3>
          <p style={styles.summaryNumber}>{total.totalBookings}</p>
        </div>
        <div style={{ ...styles.summaryCard, backgroundColor: "#d4edda" }}>
          <h3>Confirmed</h3>
          <p style={styles.summaryNumber}>{total.confirmedCount}</p>
        </div>
        <div style={{ ...styles.summaryCard, backgroundColor: "#cce5ff" }}>
          <h3>Completed</h3>
          <p style={styles.summaryNumber}>{total.completedCount}</p>
        </div>
        <div style={{ ...styles.summaryCard, backgroundColor: "#f8d7da" }}>
          <h3>Cancelled</h3>
          <p style={styles.summaryNumber}>{total.cancelledCount}</p>
        </div>
        <div
          style={{ ...styles.summaryCard, backgroundColor: "#d1ecf1" }}
          onMouseEnter={() => setIsHoverd(true)}
          onMouseLeave={() => setIsHoverd(false)}
        >
          <h3>Revenue</h3>
          {isHoverd && (
            <p
              style={{
                ...styles.hoverText,
                color: isHoverd && "#ff5733",
                textDecoration: isHoverd && "underline",
              }}
            >
              As for completed
            </p>
          )}
          <p style={styles.summaryNumber}>${total.totalRevenue}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label>Time Period:</label>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === "all" ? "#3498db" : "#ecf0f1",
                color: filter === "all" ? "white" : "#333",
              }}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === "today" ? "#3498db" : "#ecf0f1",
                color: filter === "today" ? "white" : "#333",
              }}
              onClick={() => setFilter("today")}
            >
              Today
            </button>
            <button
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === "week" ? "#3498db" : "#ecf0f1",
                color: filter === "week" ? "white" : "#333",
              }}
              onClick={() => setFilter("week")}
            >
              This Week
            </button>
            <button
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === "month" ? "#3498db" : "#ecf0f1",
                color: filter === "month" ? "white" : "#333",
              }}
              onClick={() => setFilter("month")}
            >
              This Month
            </button>
          </div>
        </div>

        <div style={styles.filterGroup}>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        <button style={styles.refreshBtn} onClick={fetchBookings}>
          Refresh
        </button>
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No bookings found</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Staff</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <tr key={booking._id}>
                    <td>
                      {formatDate(booking.date)}
                      <br />
                      <small>{formatTime(booking.date)}</small>
                    </td>
                    <td>
                      <strong>{booking.customerId?.name}</strong>
                      <br />
                      <small>{booking.customerId?.email}</small>
                      <br />
                      <small>{booking.customerId?.phone}</small>
                    </td>
                    <td>{booking.serviceId?.name}</td>
                    <td>{booking.staffId?.name}</td>
                    <td>{booking.duration} min</td>
                    <td>${booking.totalPrice}</td>
                    <td>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {statusStyle.text}
                      </span>
                    </td>
                    <td>
                      <select
                        onChange={(e) =>
                          handleUpdateStatus(booking._id, e.target.value)
                        }
                        defaultValue=""
                        style={styles.actionSelect}
                      >
                        <option value="" disabled>
                          Change Status
                        </option>
                        {getStatusOptions(booking.status).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  summaryCard: {
    backgroundColor: "#ecf0f1",
    padding: "1rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  summaryNumber: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  filters: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
  },
  filterBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  select: {
    padding: "0.5rem 1rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "0.9rem",
  },
  refreshBtn: {
    padding: "0.5rem 1.5rem",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflowX: "auto",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  statusBadge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    display: "inline-block",
  },
  actionSelect: {
    padding: "0.25rem 0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
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
    backgroundColor: "white",
    borderRadius: "8px",
    color: "#7f8c8d",
  },
  hoverText: {
    color: "black",
    fontSize: "18px",
    cursor: "pointer",
    /* Adds a smooth change instead of an instant snap */
    transition: "color 0.3s ease, text-decoration 0.3s ease",
  },
};
