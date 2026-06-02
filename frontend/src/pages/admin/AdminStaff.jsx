import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "hairdresser",
    bio: "",
    services: [],
    isActive: true,
    schedule: {
      monday: {
        isWorking: true,
        start: "09:00",
        end: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      tuesday: {
        isWorking: true,
        start: "09:00",
        end: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      wednesday: {
        isWorking: true,
        start: "09:00",
        end: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      thursday: {
        isWorking: true,
        start: "09:00",
        end: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      friday: {
        isWorking: true,
        start: "09:00",
        end: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      saturday: {
        isWorking: false,
        start: "10:00",
        end: "15:00",
        breakStart: "12:00",
        breakEnd: "12:30",
      },
      sunday: { isWorking: false },
    },
  });

  const roles = [
    { value: "hairdresser", label: "Hairdresser", icon: "✂️" },
    { value: "nail_technician", label: "Nail Technician", icon: "💅" },
    { value: "masseuse", label: "Masseuse", icon: "💆" },
    { value: "esthetician", label: "Esthetician", icon: "✨" },
    { value: "manager", label: "Manager", icon: "👔" },
  ];

  useEffect(() => {
    fetchStaff();
    fetchServices();
  }, []);

  async function fetchStaff() {
    try {
      setLoading(true);
      const response = await api.get("/admin/staff");
      setStaff(response.data.data || []);
    } catch (error) {
      console.error("Fetch staff error:", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const response = await api.get("/admin/services");
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Fetch services error:", error);
    }
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingStaff) {
        await api.put(`/admin/staff/${editingStaff._id}`, formData);
        toast.success("Staff member updated successfully");
      } else {
        await api.post("/admin/new/staff", formData);
        toast.success("Staff member added successfully");
      }

      setShowModal(false);
      setEditingStaff(null);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  }

  function handleEdit(staffMember) {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      bio: staffMember.bio || "",
      services: staffMember.services.map((s) => s._id || s),
      isActive: staffMember.isActive,
      schedule: staffMember.schedule || formData.schedule,
    });
    setShowModal(true);
  }

  function handleServiceToggle(serviceId) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((service) => service !== serviceId)
        : [...prev.services, serviceId],
    }));
  }

  function handleScheduleChange(day, field, value) {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: field === "isWorking" ? value : value,
        },
      },
    }));
  }

  async function handleDelete(staffMember) {
    if (
      !window.confirm(
        `Delete ${staffMember.name}? This will affect their future bookings.`,
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admin/staff/${staffMember._id}`);
      toast.success("Staff member deleted");
      fetchStaff();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff");
    }
  }

  async function handleToggleActive(staffMember) {
    try {
      await api.patch(`/admin/staff/${staffMember._id}/toggle`);
      toast.success(
        `Staff ${staffMember.isActive ? "deactivated" : "activated"}`,
      );
      fetchStaff();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update staff status");
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "hairdresser",
      bio: "",
      services: [],
      isActive: true,
      schedule: {
        monday: {
          isWorking: true,
          start: "09:00",
          end: "17:00",
          breakStart: "13:00",
          breakEnd: "14:00",
        },
        tuesday: {
          isWorking: true,
          start: "09:00",
          end: "17:00",
          breakStart: "13:00",
          breakEnd: "14:00",
        },
        wednesday: {
          isWorking: true,
          start: "09:00",
          end: "17:00",
          breakStart: "13:00",
          breakEnd: "14:00",
        },
        thursday: {
          isWorking: true,
          start: "09:00",
          end: "17:00",
          breakStart: "13:00",
          breakEnd: "14:00",
        },
        friday: {
          isWorking: true,
          start: "09:00",
          end: "17:00",
          breakStart: "13:00",
          breakEnd: "14:00",
        },
        saturday: {
          isWorking: false,
          start: "10:00",
          end: "15:00",
          breakStart: "12:00",
          breakEnd: "12:30",
        },
        sunday: { isWorking: false },
      },
    });
    setEditingStaff(null);
  }

  function getRoleIcon(role) {
    const found = roles.find((r) => r.value === role);
    return found ? found.icon : "👤";
  }

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading staff...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Staff</h1>
          <p style={styles.subtitle}>
            Add, edit, or remove salon staff members
          </p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Staff Member
        </button>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search staff by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <span style={styles.resultCount}>
            Found {filteredStaff.length} of {staff.length} staff members
          </span>
        )}
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No staff members found. Add your first staff member!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredStaff.map((member) => (
            <div
              key={member._id}
              style={{ ...styles.card, opacity: member.isActive ? 1 : 0.6 }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.staffIcon}>{getRoleIcon(member.role)}</div>
                <div style={styles.staffInfo}>
                  <h3 style={styles.staffName}>{member.name}</h3>
                  <span style={styles.roleBadge}>{member.role}</span>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: member.isActive ? "#d4edda" : "#f8d7da",
                    color: member.isActive ? "#155724" : "#721c24",
                  }}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div style={styles.cardBody}>
                <p>
                  <strong>Email:</strong> {member.email}
                </p>
                <p>
                  <strong>Phone:</strong> {member.phone}
                </p>
                <p>
                  <strong>Bio:</strong> {member.bio || "No bio provided"}
                </p>
                <p>
                  <strong>Services:</strong> {member.services?.length || 0}{" "}
                  services
                </p>
              </div>

              <div style={styles.cardActions}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </button>
                <button
                  style={styles.toggleBtn}
                  onClick={() => handleToggleActive(member)}
                >
                  {member.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(member)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Basic Information */}
              <div style={styles.formSection}>
                <h3>Basic Information</h3>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label>Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.icon} {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Tell customers about this staff member..."
                  />
                </div>
              </div>

              {/* Services Selection */}
              <div style={styles.formSection}>
                <h3>Services Offered</h3>
                <div style={styles.servicesGrid}>
                  {services.map((service) => (
                    <label key={service._id} style={styles.serviceCheckbox}>
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service._id)}
                        onChange={() => handleServiceToggle(service._id)}
                      />
                      {service.name} ({service.duration} min - ${service.price})
                    </label>
                  ))}
                </div>
              </div>

              {/* Schedule Editor - ADD THIS SECTION */}
              <div style={styles.formSection}>
                <h3>Working Schedule</h3>
                <p style={styles.scheduleNote}>
                  Set working hours for each day
                </p>

                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => (
                  <div key={day} style={styles.scheduleDay}>
                    <div style={styles.scheduleHeader}>
                      <span style={styles.dayName}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                      <label style={styles.workingToggle}>
                        <input
                          type="checkbox"
                          checked={formData.schedule[day].isWorking}
                          onChange={(e) =>
                            handleScheduleChange(
                              day,
                              "isWorking",
                              e.target.checked,
                            )
                          }
                        />
                        Working Day
                      </label>
                    </div>

                    {formData.schedule[day].isWorking && (
                      <div style={styles.scheduleTimes}>
                        <div style={styles.timeInput}>
                          <label>Start Time</label>
                          <input
                            type="time"
                            value={formData.schedule[day].start}
                            onChange={(e) =>
                              handleScheduleChange(day, "start", e.target.value)
                            }
                          />
                        </div>
                        <div style={styles.timeInput}>
                          <label>End Time</label>
                          <input
                            type="time"
                            value={formData.schedule[day].end}
                            onChange={(e) =>
                              handleScheduleChange(day, "end", e.target.value)
                            }
                          />
                        </div>
                        <div style={styles.timeInput}>
                          <label>Break Start</label>
                          <input
                            type="time"
                            value={formData.schedule[day].breakStart}
                            onChange={(e) =>
                              handleScheduleChange(
                                day,
                                "breakStart",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div style={styles.timeInput}>
                          <label>Break End</label>
                          <input
                            type="time"
                            value={formData.schedule[day].breakEnd}
                            onChange={(e) =>
                              handleScheduleChange(
                                day,
                                "breakEnd",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {!formData.schedule[day].isWorking && (
                      <div style={styles.dayOff}>Day Off</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Active Status */}
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Staff member is active (available for bookings)
                </label>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  subtitle: {
    color: "#7f8c8d",
  },
  addBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  searchContainer: {
    marginBottom: "2rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  resultCount: {
    display: "block",
    marginTop: "0.5rem",
    color: "#7f8c8d",
    fontSize: "0.9rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  staffIcon: {
    fontSize: "2rem",
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#2c3e50",
  },
  roleBadge: {
    backgroundColor: "#ecf0f1",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    display: "inline-block",
  },
  statusBadge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: "bold",
  },
  cardBody: {
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },
  editBtn: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  toggleBtn: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #ecf0f1",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  form: {
    padding: "1.5rem",
  },
  formSection: {
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #ecf0f1",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.5rem",
    maxHeight: "200px",
    overflowY: "auto",
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  serviceCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  cancelBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
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
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    color: "#7f8c8d",
  },
  scheduleNote: {
    fontSize: "0.85rem",
    color: "#7f8c8d",
    marginBottom: "1rem",
  },
  scheduleDay: {
    border: "1px solid #ecf0f1",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  scheduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  dayName: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  workingToggle: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  scheduleTimes: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
  },
  timeInput: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  dayOff: {
    color: "#95a5a6",
    fontStyle: "italic",
    padding: "0.5rem 0",
  },
};
