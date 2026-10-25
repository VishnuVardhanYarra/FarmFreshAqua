import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { API_URL } from "../api/config";
import { analyzeImage as apiAnalyzeImage } from "../api/image";

const AIDiseasePrediction = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // "file" or "camera"

  // Class mapping for predicted_class IDs to disease names
  const classMapping = {
    124: "Early Mortality Syndrome",
    125: "White Spot Disease",
    // Add more mappings here
  };

  // Sample diseases data (fallback if API doesn't provide details)
  const diseases = [
    {
      id: 124,
      name: "Early Mortality Syndrome (EMS)",
      description: "Also known as Acute Hepatopancreatic Necrosis Disease (AHPND), causes mass mortality in early stages.",
      symptoms: ["Empty gut", "Pale hepatopancreas", "Soft shell", "Slow growth"],
      treatment: "Antibiotics may help in early stages, but prevention is key.",
      prevention: ["Use certified shrimp postlarvae", "Probiotics in feed", "Proper pond management"],
      severity: "High"
    },
    {
      id: 125,
      name: "White Spot Disease",
      description: "A highly contagious viral disease that causes white spots on the shell and high mortality rates.",
      symptoms: ["White spots on shell", "Lethargy", "Reduced appetite", "High mortality"],
      treatment: "No effective treatment. Focus on prevention through biosecurity measures.",
      prevention: ["Disinfect ponds", "Use PCR-tested postlarvae", "Maintain water quality", "Avoid stress"],
      severity: "High"
    },
    {
      id: 0,
      name: "No Disease Detected",
      description: "Your prawns appear healthy with no signs of common diseases.",
      symptoms: ["Normal behavior", "Good appetite", "Regular growth patterns"],
      treatment: "Continue with current management practices.",
      prevention: ["Maintain good water quality", "Regular health checks", "Balanced nutrition"],
      severity: "None"
    }
  ];

  const generatePDF = () => {
  if (!analysisResult) return;

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Shrimp Disease Analysis Report", 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Filename: ${analysisResult.filename}`, 20, 35);
  doc.text(`Predicted Disease: ${analysisResult.name}`, 20, 45);
  doc.text(`Confidence: ${(analysisResult.confidence * 100).toFixed(2)}%`, 20, 55);
  doc.text(`Severity: ${analysisResult.severity}`, 20, 65);

  doc.text("Description:", 20, 75);
  doc.text(doc.splitTextToSize(analysisResult.description, 170), 20, 80);

  if (analysisResult.symptoms?.length) {
    doc.text("Symptoms:", 20, 95 + analysisResult.description.length / 2);
    analysisResult.symptoms.forEach((symptom, index) => {
      doc.text(`- ${symptom}`, 25, 105 + index * 7);
    });
  }

  if (analysisResult.treatment || analysisResult.prevention?.length) {
    let startY = 120 + (analysisResult.symptoms?.length || 0) * 7;
    doc.text("Treatment & Prevention:", 20, startY);
    if (analysisResult.treatment) doc.text(`Treatment: ${analysisResult.treatment}`, 25, startY + 10);
    if (analysisResult.prevention?.length) {
      analysisResult.prevention.forEach((p, i) => {
        doc.text(`- ${p}`, 25, startY + 20 + i * 7);
      });
    }
  }

  doc.save(`${analysisResult.filename}_report.pdf`);
};
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setErrorMessage("");
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
      setErrorMessage("");
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setErrorMessage("Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      const data = await apiAnalyzeImage(selectedImage);

      const predictedId = data.predicted_class;
      const diseaseDetails = diseases.find(d => d.id === predictedId) || {
        id: predictedId,
        name: classMapping[predictedId] || `Class ID: ${predictedId}`,
        description: "Prediction generated by AI model. For clinical diagnoses, consult aquaculture specialists.",
        symptoms: ["Observation recommended"],
        treatment: "Follow biosecurity and optimal pond water management protocols.",
        prevention: ["Maintain good water quality", "Regular health checks", "Bio-secure farming"],
        severity: "Monitored"
      };

      setAnalysisResult({
        ...diseaseDetails,
        filename: selectedImage.name,
        url: `${API_URL}${data.url}`,
        predicted_class: predictedId,
        confidence: data.confidence,
        model: data.model || "resnet18"
      });

    } catch (error) {
      console.error("Prediction analysis failed:", error);
      const detail = error.response?.data?.detail;
      const msg = typeof detail === "string"
        ? detail
        : error.message || "Prediction failed. Please check network connection or try another image.";
      setErrorMessage(msg);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setAnalysisResult(null);
    setErrorMessage("");
  };

  const simulateCameraCapture = () => {
    // This is a simulation - in a real app, you would use the device camera
    alert("Camera feature would be implemented here. For this demo, please use file upload.");
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
          <button style={styles.backButton} onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.title}>AI Disease Detection</h1>
        <p style={styles.subtitle}>
          Upload images of your prawns for instant AI analysis and early disease detection
        </p>

        {/* Upload Options */}
        <div style={styles.uploadOptions}>
          <button 
            style={{
              ...styles.uploadOptionBtn,
              ...(uploadMethod === "file" ? styles.activeUploadOption : {})
            }}
            onClick={() => setUploadMethod("file")}
          >
            📁 Upload Image
          </button>
          <button 
            style={{
              ...styles.uploadOptionBtn,
              ...(uploadMethod === "camera" ? styles.activeUploadOption : {})
            }}
            onClick={simulateCameraCapture}
          >
            📷 Use Camera
          </button>
        </div>

        {/* Upload Area */}
        {!analysisResult ? (
          <div style={styles.uploadSection}>
            <div 
              style={styles.uploadArea}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileSelect}
              />
              
              {previewUrl ? (
                <div style={styles.previewContainer}>
                  <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                  <button 
                    style={styles.changeImageButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl("");
                      setSelectedImage(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.uploadIcon}>📸</div>
                  <h3 style={styles.uploadText}>Upload Prawn Image</h3>
                  <p style={styles.uploadSubtext}>Click or drag & drop to upload an image</p>
                  <p style={styles.uploadSubtext}>JPEG, PNG, or JPG files (max 5MB)</p>
                </>
              )}
            </div>

            {errorMessage && (
              <div style={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                padding: "12px 16px",
                borderRadius: "8px",
                margin: "12px 0",
                border: "1px solid #f87171",
                fontSize: "14px",
                textAlign: "center"
              }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {selectedImage && (
              <button 
                style={styles.analyzeButton}
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span style={styles.spinner}></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </button>
            )}
          </div>
        ) : (
          /* Results Section */
          <div style={styles.resultsSection}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>Analysis Complete</h2>
              <button style={styles.newAnalysisButton} onClick={resetAnalysis}>
                Analyze Another Image
              </button>
            </div>

            <div style={styles.resultCard}>
              <div style={styles.resultStatus}>
                <div style={{
                  ...styles.statusIndicator,
                  backgroundColor: analysisResult.severity === "None" ? "#4caf50" : "#e76f51"
                }}>
                  {analysisResult.severity === "None" ? "✅" : "⚠️"}
                </div>
                <div>
                  <h3 style={styles.diseaseName}>{analysisResult.name}</h3>
                  <p style={styles.confidence}>Confidence: {(analysisResult.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>

              <div style={styles.imagePreview}>
                <p><strong>Filename:</strong> {analysisResult.filename}</p>
                <img
                  src={analysisResult.url}
                  alt="Analysis result"
                  style={styles.resultImage}
                />
              </div>

              <div style={styles.resultDetails}>
                <div style={styles.detailSection}>
                  <h4 style={styles.detailTitle}>Description</h4>
                  <p>{analysisResult.description}</p>
                </div>

                {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                  <div style={styles.detailSection}>
                    <h4 style={styles.detailTitle}>Symptoms</h4>
                    <ul style={styles.symptomList}>
                      {analysisResult.symptoms.map((symptom, index) => (
                        <li key={index} style={styles.symptomItem}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={styles.detailSection}>
                  <h4 style={styles.detailTitle}>
                    {analysisResult.severity === "None" ? "Prevention" : "Treatment & Prevention"}
                  </h4>
                  <ul style={styles.treatmentList}>
                    {analysisResult.treatment && analysisResult.treatment !== "N/A" && (
                      <li style={styles.treatmentItem}><strong>Treatment:</strong> {analysisResult.treatment}</li>
                    )}
                    {analysisResult.prevention && analysisResult.prevention.map((prevention, index) => (
                      <li key={index} style={styles.treatmentItem}>{prevention}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <button style={styles.saveReportButton} onClick={generatePDF}>
                      💾 Save Report
                </button>
                <button style={styles.consultExpertButton}>
                  👨‍⚕️ Consult Expert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disease Information */}
        {!analysisResult && (
          <div style={styles.diseaseInfo}>
            <h2 style={styles.sectionTitle}>Common Prawn Diseases</h2>
            <div style={styles.diseaseGrid}>
              {diseases.filter(d => d.severity !== "None").map(disease => (
                <div key={disease.id} style={styles.diseaseCard}>
                  <h3 style={styles.diseaseCardTitle}>{disease.name}</h3>
                  <p style={styles.diseaseCardDesc}>{disease.description}</p>
                  <div style={styles.diseaseCardSymptoms}>
                    <strong>Symptoms:</strong> {disease.symptoms.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "1rem 0"
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  logoIcon: {
    fontSize: "28px",
    marginRight: "10px"
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2a9d8f"
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#2a9d8f",
    border: "2px solid #2a9d8f",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px"
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem 20px"
  },
  title: {
    fontSize: "2.5rem",
    color: "#264653",
    textAlign: "center",
    marginBottom: "1rem"
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#6c757d",
    textAlign: "center",
    marginBottom: "3rem"
  },
  uploadOptions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem"
  },
  uploadOptionBtn: {
    padding: "12px 24px",
    backgroundColor: "#e9ecef",
    color: "#495057",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px"
  },
  activeUploadOption: {
    backgroundColor: "#2a9d8f",
    color: "white"
  },
  uploadSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "3rem"
  },
  uploadArea: {
    width: "100%",
    maxWidth: "500px",
    height: "300px",
    border: "2px dashed #2a9d8f",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: "rgba(42, 157, 143, 0.05)",
    transition: "all 0.3s ease",
    marginBottom: "2rem",
    padding: "20px"
  },
  uploadIcon: {
    fontSize: "3rem",
    marginBottom: "1rem"
  },
  uploadText: {
    fontSize: "1.5rem",
    color: "#2a9d8f",
    marginBottom: "0.5rem"
  },
  uploadSubtext: {
    color: "#6c757d",
    margin: "0.2rem 0"
  },
  previewContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
  },
  changeImageButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer"
  },
  analyzeButton: {
    padding: "15px 30px",
    backgroundColor: "#2a9d8f",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  resultsSection: {
    width: "100%"
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem"
  },
  resultTitle: {
    fontSize: "2rem",
    color: "#264653"
  },
  newAnalysisButton: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#2a9d8f",
    border: "2px solid #2a9d8f",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer"
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "2rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  resultStatus: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e9ecef"
  },
  statusIndicator: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },
  diseaseName: {
    fontSize: "1.5rem",
    color: "#264653",
    margin: "0 0 0.5rem 0"
  },
  confidence: {
    color: "#6c757d",
    margin: "0"
  },
  imagePreview: {
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e9ecef"
  },
  resultImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "8px",
    marginTop: "10px"
  },
  resultDetails: {
    marginBottom: "2rem"
  },
  detailSection: {
    marginBottom: "1.5rem"
  },
  detailTitle: {
    fontSize: "1.2rem",
    color: "#264653",
    marginBottom: "0.5rem"
  },
  symptomList: {
    paddingLeft: "1.5rem",
    margin: "0"
  },
  symptomItem: {
    marginBottom: "0.5rem"
  },
  treatmentList: {
    paddingLeft: "1.5rem",
    margin: "0"
  },
  treatmentItem: {
    marginBottom: "0.5rem"
  },
  actionButtons: {
    display: "flex",
    gap: "1rem"
  },
  saveReportButton: {
    padding: "12px 24px",
    backgroundColor: "#264653",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  consultExpertButton: {
    padding: "12px 24px",
    backgroundColor: "#e9c46a",
    color: "#264653",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  diseaseInfo: {
    marginTop: "3rem"
  },
  sectionTitle: {
    fontSize: "2rem",
    color: "#264653",
    textAlign: "center",
    marginBottom: "2rem"
  },
  diseaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem"
  },
  diseaseCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  },
  diseaseCardTitle: {
    fontSize: "1.2rem",
    color: "#264653",
    marginBottom: "0.5rem"
  },
  diseaseCardDesc: {
    color: "#6c757d",
    marginBottom: "1rem"
  },
  diseaseCardSymptoms: {
    fontSize: "0.9rem",
    color: "#495057"
  }
};

export default AIDiseasePrediction;