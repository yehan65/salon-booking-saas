import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllServices();
  }, []);

  async function fetchAllServices() {
    setLoading(true);
    try {
      const response = await api.get("/public/services");
      setServices(response.data.data);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message || "Services could not fetch!");
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "all",
    ...new Set(services.map((service) => service.category)),
  ];

  // function filterCategories() {
  //   if (selectedCategory === 'all') {
  //     return service;
  //   } else {
  //     return services.map(service => service.cateogry === selectedCategory)
  //   }
  // }

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const handleBookNow = (serviceId) => {
    navigate(`/booking/${serviceId}`);
  };

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
      <h1 style={styles.title}>Our Services</h1>
      <p style={styles.subtitle}>Choose from our professional salon services</p>

      {/* Category Filters */}
      <div style={styles.filterContainer}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              ...styles.filterBtn,
              backgroundColor:
                selectedCategory === category ? "#3498db" : "#ecf0f1",
              color: selectedCategory === category ? "white" : "#333",
            }}
          >
            {category === "all" ? "All Services" : category}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div style={styles.empty}>
          <p>No services found in this category.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredServices.map((service) => (
            <div key={service._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.serviceName}>{service.name}</h3>
                <span style={styles.category}>{service.category}</span>
              </div>
              <p style={styles.description}>{service.description}</p>
              <div style={styles.details}>
                <span style={styles.duration}>⏱️ {service.duration} min</span>
                <span style={styles.price}>💰 ${service.price}</span>
              </div>
              <button
                onClick={() => handleBookNow(service._id)}
                style={styles.bookBtn}
              >
                Book Now
              </button>
            </div>
          ))}
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
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  subtitle: {
    color: "#7f8c8d",
    marginBottom: "2rem",
  },
  filterContainer: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },
  filterBtn: {
    padding: "0.5rem 1.5rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.3s",
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
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  serviceName: {
    fontSize: "1.25rem",
    color: "#2c3e50",
    margin: 0,
  },
  category: {
    backgroundColor: "#ecf0f1",
    padding: "0.25rem 0.75rem",
    borderRadius: "15px",
    fontSize: "0.75rem",
    color: "#7f8c8d",
  },
  description: {
    color: "#666",
    lineHeight: "1.5",
    marginBottom: "1rem",
  },
  details: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.25rem",
    paddingTop: "0.5rem",
    borderTop: "1px solid #ecf0f1",
  },
  duration: {
    color: "#3498db",
    fontWeight: "500",
  },
  price: {
    color: "#2ecc71",
    fontWeight: "bold",
  },
  bookBtn: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
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
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#7f8c8d",
  },
};
