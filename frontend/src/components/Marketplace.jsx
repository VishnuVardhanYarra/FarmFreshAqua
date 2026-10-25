// components/BuyerDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("retail");
  const [cart, setCart] = useState([]);

  // Sample products data
  const products = [
    {
      id: 1,
      name: "Fresh Tiger Prawns",
      price: 325,
      weight: "500g Pack",
      image: "https://images.unsplash.com/photo-1625937286074-9ca519a5a87a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByYXdufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      rating: 4.8,
      reviews: 126,
      badge: "Fresh"
    },
    {
      id: 2,
      name: "White Leg Prawns",
      price: 520,
      weight: "1kg Pack",
      image: "https://images.unsplash.com/photo-1592409065734-13a77d57436c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByYXdufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      rating: 4.7,
      reviews: 98,
      badge: "Popular"
    },
    {
      id: 3,
      name: "King Prawns",
      price: 800,
      weight: "1kg Pack",
      image: "https://images.unsplash.com/photo-1574969889157-45846513e716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHByYXdufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      rating: 4.9,
      reviews: 145,
      badge: "Premium"
    },
    {
      id: 4,
      name: "Jumbo Tiger Prawns",
      price: 900,
      weight: "1kg Pack",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHByYXdufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
      rating: 4.8,
      reviews: 112,
      badge: "New"
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate("/")}>
            <span style={styles.logoIcon}>🦐</span>
            <span style={styles.logoText}>Farm Fresh Aqua</span>
          </div>
          
          <nav style={styles.nav}>
            <button 
              style={{...styles.navButton, ...(activeTab === "retail" ? styles.activeNavButton : {})}}
              onClick={() => setActiveTab("retail")}
            >
              Retail Shop
            </button>
            <button 
              style={{...styles.navButton, ...(activeTab === "prebook" ? styles.activeNavButton : {})}}
              onClick={() => setActiveTab("prebook")}
            >
              Pre-Book
            </button>
            <button 
              style={{...styles.navButton, ...(activeTab === "orders" ? styles.activeNavButton : {})}}
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </button>
          </nav>
          
          <div style={styles.headerActions}>
            <div style={styles.cartIcon} onClick={() => alert("Cart would open here")}>
              <span>🛒</span>
              {cart.length > 0 && <span style={styles.cartCount}>{cart.length}</span>}
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main style={styles.main}>
        {activeTab === "retail" && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Retail Shop</h2>
            <p style={styles.sectionSubtitle}>Fresh prawns and fish available for home delivery</p>
            
            <div style={styles.productsGrid}>
              {products.map(product => (
                <div key={product.id} style={styles.productCard}>
                  <div 
                    style={{...styles.productImage, backgroundImage: `url(${product.image})`}}
                  >
                    <div style={styles.productBadge}>{product.badge}</div>
                    <div style={styles.productWeight}>{product.weight}</div>
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productTitle}>{product.name}</h3>
                    <div style={styles.productPrice}>₹{product.price} / {product.weight.includes('kg') ? 'kg' : 'pack'}</div>
                    <div style={styles.productMeta}>
                      <span>⭐ {product.rating} ({product.reviews})</span>
                    </div>
                    <button 
                      style={styles.addToCartButton}
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "prebook" && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Business Pre-Booking</h2>
            <p style={styles.sectionSubtitle}>Reserve your prawns in advance to ensure availability</p>
            
            <div style={styles.bookingForm}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Full Name</label>
                  <input type="text" placeholder="Enter your full name" style={styles.formInput} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email Address</label>
                  <input type="email" placeholder="Enter your email" style={styles.formInput} />
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" style={styles.formInput} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Business Name</label>
                  <input type="text" placeholder="Enter your business name" style={styles.formInput} />
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Business Type</label>
                  <select style={styles.formInput}>
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                    <option value="export">Export Factory</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Location</label>
                  <input type="text" placeholder="Enter your location" style={styles.formInput} />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Address</label>
                <textarea placeholder="Enter your complete address" rows="2" style={styles.formInput}></textarea>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Prawn Type</label>
                  <select style={styles.formInput}>
                    <option value="">Select prawn type</option>
                    <option value="tiger">Tiger Prawns</option>
                    <option value="white">White Prawns</option>
                    <option value="king">King Prawns</option>
                    <option value="jumbo">Jumbo Tiger Prawns</option>
                    <option value="vannamei">Vannamei</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Size</label>
                  <select style={styles.formInput}>
                    <option value="">Select size</option>
                    <option value="small">Small (51-60 count/kg)</option>
                    <option value="medium">Medium (41-50 count/kg)</option>
                    <option value="large">Large (31-40 count/kg)</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Quantity (kg)</label>
                  <input type="number" placeholder="Enter quantity in kg" style={styles.formInput} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Expected Delivery Date</label>
                  <input type="date" style={styles.formInput} />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Special Notes</label>
                <textarea placeholder="Any special requirements or notes" rows="3" style={styles.formInput}></textarea>
              </div>
              
              <button style={styles.submitButton}>
                Submit Pre-Booking Request
              </button>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Order Status & Tracking</h2>
            <p style={styles.sectionSubtitle}>Check the status of your orders and estimated delivery times</p>
            
            <div style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <h3>Order #PC-4892</h3>
                <span style={styles.statusBadge}>In Transit</span>
              </div>
              
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
              
              <div style={styles.timeline}>
                <div style={styles.timelineStep}>
                  <div style={styles.timelineIcon}>✓</div>
                  <div style={styles.timelineLabel}>Order Placed</div>
                  <div style={styles.timelineDate}>Oct 10</div>
                </div>
                <div style={styles.timelineStep}>
                  <div style={styles.timelineIcon}>📦</div>
                  <div style={styles.timelineLabel}>Packed</div>
                  <div style={styles.timelineDate}>Oct 11</div>
                </div>
                <div style={{...styles.timelineStep, ...styles.activeStep}}>
                  <div style={styles.timelineIcon}>🚚</div>
                  <div style={styles.timelineLabel}>Shipped</div>
                  <div style={styles.timelineDate}>Oct 12</div>
                </div>
                <div style={styles.timelineStep}>
                  <div style={styles.timelineIcon}>🏠</div>
                  <div style={styles.timelineLabel}>Delivered</div>
                  <div style={styles.timelineDate}>Est. Oct 14</div>
                </div>
              </div>
              
              <div style={styles.trackingInfo}>
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>🚚</div>
                  <h4>Carrier</h4>
                  <p>Farm Fresh Aqua Express</p>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>📏</div>
                  <h4>Distance</h4>
                  <p>185 km remaining</p>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>🌡️</div>
                  <h4>Temperature</h4>
                  <p>-2°C</p>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>⏰</div>
                  <h4>Est. Delivery</h4>
                  <p>Oct 14, 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.copyright}>© 2023 Farm Fresh Aqua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    color: "#343a40",
    fontFamily: "'Poppins', sans-serif"
  },
  header: {
    background: "linear-gradient(135deg, #2a5d8a 0%, #1a3a5a 100%)",
    color: "white",
    padding: "15px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer"
  },
  logoIcon: {
    color: "#ff7e30",
    fontSize: "28px"
  },
  logoText: {
    fontWeight: "bold"
  },
  nav: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  navButton: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s"
  },
  activeNavButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  cartIcon: {
    position: "relative",
    fontSize: "24px",
    cursor: "pointer"
  },
  cartCount: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    backgroundColor: "#ff7e30",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "500"
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    minHeight: "calc(100vh - 160px)"
  },
  tabContent: {
    animation: "fadeIn 0.5s ease"
  },
  sectionTitle: {
    fontSize: "36px",
    color: "#2a5d8a",
    marginBottom: "15px",
    textAlign: "center"
  },
  sectionSubtitle: {
    color: "#6c757d",
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "18px"
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
    marginTop: "30px"
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s",
    cursor: "pointer"
  },
  productImage: {
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: "15px",
    color: "white",
    position: "relative"
  },
  productBadge: {
    background: "#ff7e30",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    position: "relative",
    zIndex: 1
  },
  productWeight: {
    background: "rgba(0,0,0,0.6)",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    position: "relative",
    zIndex: 1
  },
  productInfo: {
    padding: "20px"
  },
  productTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#343a40"
  },
  productPrice: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#2a5d8a",
    marginBottom: "10px"
  },
  productMeta: {
    color: "#6c757d",
    fontSize: "14px",
    marginBottom: "15px"
  },
  addToCartButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3cb878",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  bookingForm: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    maxWidth: "800px",
    margin: "0 auto"
  },
  formRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap"
  },
  formGroup: {
    flex: "1",
    minWidth: "250px"
  },
  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#343a40"
  },
  formInput: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.3s"
  },
  submitButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#3cb878",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px"
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    maxWidth: "900px",
    margin: "0 auto"
  },
  orderHeader: {
    textAlign: "center",
    marginBottom: "30px"
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 20px",
    borderRadius: "50px",
    fontWeight: "600",
    marginTop: "15px",
    backgroundColor: "#e6f7ee",
    color: "#3cb878"
  },
  progressBar: {
    height: "8px",
    background: "#eee",
    borderRadius: "4px",
    margin: "20px 0",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(to right, #3cb878, #2a5d8a)",
    borderRadius: "4px",
    width: "75%"
  },
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    margin: "40px 0",
    flexWrap: "wrap",
    gap: "20px"
  },
  timelineStep: {
    textAlign: "center",
    flex: "1",
    minWidth: "120px"
  },
  activeStep: {
    color: "#3cb878"
  },
  timelineIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "white",
    border: "4px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
    fontSize: "16px"
  },
  timelineLabel: {
    fontWeight: "500",
    marginBottom: "5px"
  },
  timelineDate: {
    fontSize: "12px",
    color: "#6c757d"
  },
  trackingInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px"
  },
  infoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center"
  },
  infoIcon: {
    fontSize: "24px",
    marginBottom: "10px"
  },
  footer: {
    background: "linear-gradient(135deg, #2a5d8a 0%, #1a3a5a 100%)",
    color: "white",
    padding: "30px 0",
    textAlign: "center"
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px"
  },
  copyright: {
    margin: 0,
    color: "#ddd",
    fontSize: "14px"
  }
};

export default BuyerDashboard;