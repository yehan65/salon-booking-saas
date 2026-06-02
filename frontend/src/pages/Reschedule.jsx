import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function RescheduleBooking() {
  const [booking, setBooking] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { bookingId } = useParams();

  const today = new Date();

  useEffect(() => {
    previousBooking();
  }, []);

  useEffect(() => {
    if (selectedDate && booking) {
      getAvailableTimeSlots();
    }
  }, [selectedDate, booking]);

  async function previousBooking() {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data.data);
      console.log("Booking loaded:", response.data.data);
    } catch (error) {
      console.error(error.message || "Fetch Failed!");
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
  }

  async function getAvailableTimeSlots() {
    try {
      setLoading(true);
      // ✅ FIXED: Correct field names (staffId, not staffID)
      const staffId = booking?.staffId?._id || booking?.staffId;
      const serviceId = booking?.serviceId?._id || booking?.serviceId;

      const response = await api.get(
        `/availability/${staffId}?date=${selectedDate}&serviceId=${serviceId}`,
      );
      setAvailableTimeSlots(response.data.availableSlots || []);
      console.log("Available slots:", response.data.availableSlots);
    } catch (error) {
      console.error(error.message || "Failed to get time slots!");
      toast.error("Failed to load available time slots");
    } finally {
      setLoading(false);
    }
  }

  async function requestReschedule() {
    if (!selectedSlot) {
      toast.error("Please select a new time slot");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/bookings/${bookingId}/reschedule`, {
        newDate: selectedSlot.timestamp, // Make sure your backend expects 'newDate'
      });

      toast.success("Booking rescheduled successfully!");

      // Optional: Redirect back to My Bookings after 2 seconds
      setTimeout(() => {
        window.location.href = "/my-bookings";
      }, 2000);
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error(error.response?.data?.message || "Failed to reschedule");
    } finally {
      setLoading(false);
    }
  }

  function dateFormatter(data) {
    if (!data) return "No date set";
    const date = new Date(data);
    const dateFormat = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeFormat = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateFormat} at ${timeFormat}`;
  }

  function getStatusColor(status) {
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
  }

  if (loading && !booking) {
    return <div>Loading your booking...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  // Check if booking is in the past
  if (new Date(booking.date) < today) {
    return (
      <h1 style={{ color: "red", textAlign: "center" }}>
        Cannot reschedule past bookings. Please contact the salon directly.
      </h1>
    );
  }

  // Generate next 7 days for date picker
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return (
    <>
      <h2 style={styles.title}>Reschedule Booking</h2>
      <div style={styles.mainContainer}>
        {/* Current Booking Details */}
        <section style={styles.pastBookingContainer}>
          <div key={booking._id} style={styles.card}>
            {/* <h3>Current Booking</h3> */}
            <div style={styles.cardHeader}>
              <h3>{booking.serviceId?.name || "Service"}</h3>
              <span
                style={{
                  ...styles.status,
                  backgroundColor: getStatusColor(booking.status),
                }}
              >
                {booking.status}
              </span>
            </div>
            <div style={styles.cardBody}>
              <h4>
                <strong>Stylist:</strong> {booking.staffId?.name}
              </h4>
              <h4>
                <strong>Date:</strong> {dateFormatter(booking?.date)}
              </h4>
              <h4>
                <strong>Duration:</strong> {booking.duration} minutes
              </h4>
              <h4>
                <strong>Price:</strong> ${booking.totalPrice}
              </h4>
            </div>
          </div>
        </section>

        {/* Date Selector */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Pick a new date</h2>
          <div style={styles.dateContainer}>
            {dates.map((date, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedDate(date.toISOString().split("T")[0])
                }
                style={{
                  ...styles.dateBtn,
                  color:
                    selectedDate === date.toISOString().split("T")[0]
                      ? "white"
                      : "#333",
                  backgroundColor:
                    selectedDate === date.toISOString().split("T")[0]
                      ? "#3498db"
                      : "#ecf0f1",
                }}
              >
                <p>
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Time Selector */}
        <section style={styles.timeSelector}>
          <h2>Pick a new time</h2>
          {!selectedDate && <p>Please select a date first</p>}

          {selectedDate && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                Available Times for {selectedDate}
              </h3>
              {loading ? (
                <div style={styles.loadingSpinner}>
                  <div style={styles.spinner}></div>
                  <p>Loading available times...</p>
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div style={styles.noSlots}>
                  <p>
                    No available slots for this day. Please choose another date.
                  </p>
                </div>
              ) : (
                <div style={styles.slotsGrid}>
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.timestamp}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        ...styles.slotBtn,
                        backgroundColor:
                          selectedSlot?.timestamp === slot.timestamp
                            ? "#2ecc71"
                            : "#ecf0f1",
                        color:
                          selectedSlot?.timestamp === slot.timestamp
                            ? "white"
                            : "#333",
                      }}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <section style={styles.buttonGroup}>
          <button
            onClick={() => window.history.back()}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            onClick={requestReschedule}
            disabled={!selectedSlot || loading}
            style={{
              ...styles.confirmBtn,
              backgroundColor: selectedSlot ? "#2ecc71" : "#bdc3c7",
              cursor: selectedSlot ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Processing..." : "Confirm Reschedule"}
          </button>
        </section>
      </div>
    </>
  );
}

const styles = {
  title: {
    margin: "4px",
    color: "#2c3e50",
  },
  mainContainer: {
    margin: "5px",
  },
  pastBookingContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  cardBody: {
    lineHeight: "1.6rem",
  },
  status: {
    padding: "5px",
    borderRadius: "5px",
    color: "white",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  dateContainer: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  dateBtn: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.3s",
  },
  slotsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "1rem",
  },
  slotBtn: {
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "10px",
  },
  confirmBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  loadingSpinner: {
    textAlign: "center",
    padding: "2rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ecf0f1",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 1rem",
  },
  noSlots: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    color: "#7f8c8d",
  },
};
