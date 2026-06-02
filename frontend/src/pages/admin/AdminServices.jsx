import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "Hair",
    isActive: true,
  });

  const categories = [
    "Hair",
    "Nails",
    "Massage",
    "Facial",
    "Makeup",
    "Waxing",
    "Other",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const response = await api.get("/admin/services");
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Fetch services error:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/admin/services/${editingService._id}`, formData);
        toast.success("Service updated successfully");
      } else {
        await api.post("/admin/new/service", formData);
        toast.success("Service created successfully");
      }

      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  }

  function handleEdit(service) {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category,
      isActive: service.isActive,
    });
    setShowModal(true);
  }

  async function handleDelete(service) {
    if (
      !window.confirm(`Delete "${service.name}"? This action cannot be undone.`)
    ) {
      return;
    }

    try {
      await api.delete(`/admin/services/${service._id}`);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete service");
    }
  }

  async function handleToggleActive(service) {
    try {
      await api.patch(`/admin/services/${service._id}/toggle`);
      toast.success(
        `Service ${service.isActive ? "deactivated" : "activated"}`,
      );
      fetchServices();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update service status");
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "Hair",
      isActive: true,
    });
    setEditingService(null);
  }

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Services</h1>
          <p style={styles.subtitle}>Add, edit, or remove salon services</p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add New Service
        </button>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search services by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <span style={styles.resultCount}>
            Found {filteredServices.length} of {services.length} services
          </span>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No services found. Create your first service!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredServices.map((service) => (
            <div
              key={service._id}
              style={{ ...styles.card, opacity: service.isActive ? 1 : 0.6 }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.serviceName}>{service.name}</h3>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: service.isActive ? "#d4edda" : "#f8d7da",
                    color: service.isActive ? "#155724" : "#721c24",
                  }}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p style={styles.description}>{service.description}</p>
              <div style={styles.details}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Duration:</span>
                  <span>{service.duration} min</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Price:</span>
                  <span>${service.price}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Category:</span>
                  <span>{service.category}</span>
                </div>
              </div>
              <div style={styles.cardActions}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(service)}
                >
                  Edit
                </button>
                <button
                  style={styles.toggleBtn}
                  onClick={() => handleToggleActive(service)}
                >
                  {service.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(service)}
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
              <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Service Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Women's Haircut"
                />
              </div>

              <div style={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Describe the service..."
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="5"
                    max="480"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Service is active (visible to customers)
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
                  {editingService ? "Update Service" : "Create Service"}
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
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  serviceName: {
    fontSize: "1.25rem",
    margin: 0,
    color: "#2c3e50",
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  description: {
    color: "#666",
    lineHeight: "1.5",
    marginBottom: "1rem",
  },
  details: {
    borderTop: "1px solid #ecf0f1",
    paddingTop: "1rem",
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },
  editBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  toggleBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "0.5rem 1rem",
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
    maxWidth: "500px",
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
  formGroup: {
    marginBottom: "1rem",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
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
};
