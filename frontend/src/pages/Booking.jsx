import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Booking() {
  const { serviceID } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (serviceID && services.length > 0) {
      const service = services.find((service) => service._id === serviceID);
      if (service) {
        setSelectedService(service);
        setStep(2);
      }
    }
  }, [serviceID, services]);

  useEffect(() => {
    if ((selectedStaff, selectedService, selectedDate)) {
      fetchAvailableSlots();
    }
  }, [selectedStaff, selectedService, selectedDate]);

  async function fetchServices() {
    setLoading(true);
    try {
      const response = await api.get("/public/services");
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Error fetching services: ", error);
      toast.error("Failedd to load services");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStaff() {
    setLoading(true);
    try {
      const response = await api.get("/public/staff");
      setStaff(response.data.data);
    } catch (error) {
      console.error("Error fetching staff: ", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailableSlots() {
    setLoading(true);
    try {
      const response = await api.get(
        `/availability/${selectedStaff._id}?date=${selectedDate}&serviceId=${selectedService._id}`,
      );
      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error("Error fetching slots: ", error);
      toast.error("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking() {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        staffId: selectedStaff._id,
        serviceId: selectedService._id,
        date: selectedSlot.timestamp,
        customerNotes: "",
      };

      const response = await api.post("/bookings/new", bookingData);
      if (response.data.success) {
        toast.success("Booking confirmed");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Generate next 7 days
  function generateDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  if (step === 1) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Select a Service</h1>
        <p style={styles.subtitle}>Choose from our professional services</p>
        <div style={styles.grid}>
          {services.map((service) => (
            <div
              key={service._id}
              style={styles.card}
              onClick={() => {
                setSelectedService(service);
                setStep(2);
              }}
            >
              <h3 style={styles.cardTitle}>{service.name}</h3>
              <p style={styles.cardDescription}>{service.description}</p>
              <div style={styles.cardDetails}>
                <span>⏱️ {service.duration} min</span>
                <span>💰 ${service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ STEP 2: Select Staff ============
  if (step === 2) {
    // Filter staff who offer this service
    const availableStaff = staff.filter((staffMember) => {
      if (!staffMember.services || staffMember.services.length === 0) {
        return false;
      }
      return staffMember.services?.some(
        (service) => service._id === selectedService._id,
      );
    });

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Choose Your Stylist</h1>
        <p style={styles.subtitle}>For: {selectedService.name}</p>
        <div style={styles.grid}>
          {availableStaff.map((staffMember) => (
            <div
              key={staffMember._id}
              style={styles.card}
              onClick={() => {
                setSelectedStaff(staffMember);
                setStep(3);
              }}
            >
              <h3 style={styles.cardTitle}>{staffMember.name}</h3>
              <p style={styles.cardDescription}>{staffMember.role}</p>
              <p style={styles.bio}>{staffMember.bio}</p>
            </div>
          ))}
        </div>
        <button style={styles.backBtn} onClick={() => setStep(1)}>
          ← Back to Services
        </button>
      </div>
    );
  }

  if (step === 3) {
    const dates = generateDates();

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Select Date & Time</h1>
        <p style={styles.subtitle}>
          {selectedService.name} with {selectedStaff.name}
        </p>

        {/* Date Picker */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Pick a Date</h3>
          <div style={styles.dateContainer}>
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() =>
                  setSelectedDate(date.toISOString().split("T")[0])
                }
                style={{
                  ...styles.dateBtn,
                  backgroundColor:
                    selectedDate === date.toISOString().split("T")[0]
                      ? "#3498db"
                      : "#ecf0f1",
                  color:
                    selectedDate === date.toISOString().split("T")[0]
                      ? "white"
                      : "#333",
                }}
              >
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Available Times</h3>
            {loading ? (
              <div style={styles.loadingSpinner}>
                <div style={styles.spinner}></div>
                <p>Loading available slots...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div style={styles.noSlots}>
                <p>
                  No available slots for this day. Please choose another date.
                </p>
              </div>
            ) : (
              <div style={styles.slotsGrid}>
                {availableSlots.map((slot) => (
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

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.backBtn} onClick={() => setStep(2)}>
            ← Back
          </button>
          {selectedSlot && (
            <button
              style={styles.confirmBtn}
              onClick={handleBooking}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardTitle: {
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  cardDescription: {
    color: "#666",
    marginBottom: "1rem",
  },
  cardDetails: {
    display: "flex",
    justifyContent: "space-between",
    color: "#3498db",
    fontWeight: "bold",
  },
  bio: {
    fontSize: "0.9rem",
    color: "#7f8c8d",
    marginTop: "0.5rem",
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
  backBtn: {
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
