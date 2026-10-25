// components/Home.jsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleMarketplaceClick = () => {
    navigate("/marketplace");
  };

  const handleDiseaseDetectionClick = () => {
    navigate("/disease-detection");
  };

  return (
    <div style={styles.homePage}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.nav}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🦐</span>
              <span style={styles.logoText}>Farm Fresh Aqua</span>
            </div>
            <div style={styles.authButtons}>
              <button style={styles.btnOutline} onClick={handleLoginClick}>
                Login
              </button>
              <button style={styles.btn} onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>Revolutionizing Prawn Farming with IoT & AI Technology</h1>
              <p style={styles.heroDescription}>
                Maximize your yield, minimize risks, and get the best prices for your produce with our advanced monitoring system and coordinated farming approach.
              </p>
              <div style={styles.heroButtons}>
                <button style={styles.btn} onClick={handleSignUpClick}>
                  Get Started
                </button>
                <button style={{...styles.btn, ...styles.btnOutline}} onClick={handleMarketplaceClick}>
                  Visit Marketplace
                </button>
              </div>
            </div>
            <div style={styles.heroImage}>
              <div style={styles.imagePlaceholder}>
                <span style={styles.imageText}>Prawn Farming Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📅</div>
              <h3>Cyclic Farming</h3>
              <p>Staggered farming cycles ensure consistent production without overproduction or shortages.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>❤️</div>
              <h3>Health Monitoring</h3>
              <p>IoT sensors continuously monitor water quality and prawn health parameters.</p>
            </div>
            <div style={styles.featureCard} onClick={handleDiseaseDetectionClick}>
              <div style={styles.featureIcon}>🤖</div>
              <h3>AI Disease Detection</h3>
              <p>Upload images of prawns for instant AI analysis and early disease detection.</p>
              <button style={styles.featureButton} onClick={handleDiseaseDetectionClick}>
                Try Now
              </button>
            </div>
          </div>
        </div>
      </section>

 <section style={styles.tracking}>
  <div style={styles.container}>
    <div style={styles.sectionTitleWrapper}>
      <h2 style={styles.sectionTitle}>QR Code Tracking</h2>
      <p style={styles.sectionDescription}>
        Scan the QR code to get complete information about your prawns
      </p>
    </div>

    {/* Dynamic QR Code */}
    <div style={styles.qrCode}>
      <QRCodeCanvas
        value={JSON.stringify({
          prawnType: "Tiger Prawns",
          freshnessRate: "98%",
          healthCondition: "Excellent",
          dateOfPackage: "Oct 12, 2023",
          expectedDelivery: "Oct 15, 2023",
          storageTemperature: "-2°C to 2°C"
        })}
        size={200}
        bgColor={"#ffffff"}
        fgColor={"#2a9d8f"}
        level={"H"}
        includeMargin={true}
      />
    </div>

    <div style={styles.trackingInfo}>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>Prawn Type:</span>
        <span>Tiger Prawns</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>Freshness Rate:</span>
        <span>98%</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>Health Condition:</span>
        <span>Excellent</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>Date of Package:</span>
        <span>Oct 12, 2023</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>Expected Delivery:</span>
        <span>Oct 15, 2023</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>Storage Temperature:</span>
        <span>-2°C to 2°C</span>
      </div>
    </div>
  </div>
</section>

      

      {/* Call to Action Section */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaDescription}>Join hundreds of farmers who are already benefiting from our platform</p>
          <div style={styles.ctaButtons}>
            <button style={styles.btn} onClick={handleSignUpClick}>
              Sign Up Now
            </button>
            <button style={{...styles.btn, ...styles.btnOutline}} onClick={handleDiseaseDetectionClick}>
              Try Disease Detection
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <p style={styles.copyright}>© 2023 Farm Fresh Aqua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  homePage: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    color: "#343a40",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box"
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    boxSizing: "border-box"
  },
  header: {
    backgroundColor: "white",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
    padding: "20px 0",
    width: "100%",
    boxSizing: "border-box"
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "24px",
    color: "#2a9d8f",
    cursor: "pointer"
  },
  logoIcon: {
    marginRight: "10px",
    fontSize: "28px"
  },
  logoText: {
    fontWeight: "bold"
  },
  authButtons: {
    display: "flex",
    gap: "15px"
  },
  btn: {
    padding: "12px 28px",
    backgroundColor: "#2a9d8f",
    color: "white",
    borderRadius: "50px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease"
  },
  btnOutline: {
    padding: "12px 28px",
    backgroundColor: "transparent",
    color: "#2a9d8f",
    border: "2px solid #2a9d8f",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease"
  },
  hero: {
    padding: "100px 0",
    background: "linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)",
    width: "100%",
    boxSizing: "border-box"
  },
  heroContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    width: "100%"
  },
  heroText: {
    flex: 1,
    minWidth: 0
  },
  heroTitle: {
    fontSize: "3rem",
    marginBottom: "20px",
    color: "#264653",
    lineHeight: "1.2"
  },
  heroDescription: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#555",
    lineHeight: "1.6"
  },
  heroButtons: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },
  heroImage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    minWidth: 0
  },
  imagePlaceholder: {
    width: "100%",
    maxWidth: "400px",
    height: "300px",
    backgroundColor: "#2a9d8f",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold"
  },
  features: {
    padding: "80px 0",
    backgroundColor: "white",
    width: "100%",
    boxSizing: "border-box"
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "60px",
    color: "#264653"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    width: "100%"
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    position: "relative"
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "20px"
  },
  featureButton: {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "#2a9d8f",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  },
  
  ctaSection: {
    padding: "80px 0",
    backgroundColor: "linear-gradient(135deg, #2a9d8f 0%, #1d7875 100%)",
    background: "linear-gradient(135deg, #2a9d8f 0%, #1d7875 100%)",
    color: "white",
    textAlign: "center",
    width: "100%",
    boxSizing: "border-box"
  },
  ctaTitle: {
    fontSize: "2.5rem",
    marginBottom: "20px"
  },
  ctaDescription: {
    fontSize: "1.2rem",
    marginBottom: "40px",
    opacity: 0.9
  },
  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap"
  },
  footer: {
    backgroundColor: "#264653",
    color: "white",
    padding: "40px 0",
    textAlign: "center",
    width: "100%",
    boxSizing: "border-box"
  },
  copyright: {
    margin: 0,
    color: "#ced4da"
  },
  tracking: {
  padding: "80px 0",
  backgroundColor: "#f0fdfd",
  textAlign: "center"
},
sectionTitleWrapper: {
  marginBottom: "40px"
},
sectionDescription: {
  fontSize: "1.1rem",
  color: "#555",
  marginTop: "10px"
},
qrCode: {
  fontSize: "100px",
  color: "#2a9d8f",
  margin: "20px auto"
},
qrIcon: {
  fontSize: "100px"
},
trackingInfo: {
  marginTop: "30px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  textAlign: "left",
  maxWidth: "800px",
  marginLeft: "auto",
  marginRight: "auto"
},
infoItem: {
  background: "white",
  padding: "15px 20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "1rem",
  fontWeight: "500"
},
infoLabel: {
  fontWeight: "600",
  color: "#264653"
}

};

export default Home;