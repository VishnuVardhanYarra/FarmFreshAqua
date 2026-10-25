// components/Signup.jsx
import React, { useState } from "react";
import { registerFarmer, loginFarmer } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    acres: "",
    crop_start_date: "",
    yield_date: "",
    health_condition: "",
    role: "farmer" // Default role
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    const trimmedPhone = formData.phone.trim();
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!trimmedPhone) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(trimmedPhone)) newErrors.phone = "Please enter a valid 10-digit phone number";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    }
    
    if (step === 2) {
      if (formData.role === "farmer") {
        if (!formData.acres || formData.acres <= 0) newErrors.acres = "Please enter a valid acreage";
        if (!formData.crop_start_date) newErrors.crop_start_date = "Crop start date is required";
        if (!formData.yield_date) newErrors.yield_date = "Expected yield date is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(2)) {
      setIsSubmitting(true);
      try {
        const payload = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password,
          acres: formData.role === "buyer" ? (Number(formData.acres) || 0) : Number(formData.acres),
          crop_start_date: formData.crop_start_date || new Date().toISOString().split("T")[0],
          yield_date: formData.yield_date || new Date().toISOString().split("T")[0],
          health_condition: formData.health_condition || "Normal",
          role: formData.role
        };

        await registerFarmer(payload);
        
        // Auto-login upon successful registration
        try {
          const res = await loginFarmer(payload.phone, payload.password);
          const token = res.token || res.access_token;
          const role = res.role || payload.role;

          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("userPhone", payload.phone);

          sessionStorage.setItem("token", token);
          sessionStorage.setItem("role", role);

          navigate(role === "buyer" ? "/buyer-dashboard" : "/farmer-dashboard");
        } catch {
          navigate("/login");
        }
      } catch (err) {
        const detail = err.response?.data?.detail;
        const msg = typeof detail === "string" ? detail : err.message || "Error registering";
        setErrors({ submit: msg });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const progressPercentage = (step / 2) * 100;

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Your Account</h1>
          <p>Join our agricultural community today</p>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>Account Details</div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>Farm Information</div>
        </div>
        
        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}
          
          {step === 1 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="role">I am a:</label>
                <select 
                  id="role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="role-select"
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                  maxLength="10"
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="acres">Farm Size (Acres) *</label>
                <input
                  id="acres"
                  name="acres"
                  type="number"
                  placeholder="Enter farm size in acres"
                  value={formData.acres}
                  onChange={handleChange}
                  className={errors.acres ? "error" : ""}
                />
                {errors.acres && <span className="field-error">{errors.acres}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="crop_start_date">Crop Start Date *</label>
                <input
                  id="crop_start_date"
                  name="crop_start_date"
                  type="date"
                  value={formData.crop_start_date}
                  onChange={handleChange}
                  className={errors.crop_start_date ? "error" : ""}
                />
                {errors.crop_start_date && <span className="field-error">{errors.crop_start_date}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="yield_date">Expected Yield Date *</label>
                <input
                  id="yield_date"
                  name="yield_date"
                  type="date"
                  value={formData.yield_date}
                  onChange={handleChange}
                  className={errors.yield_date ? "error" : ""}
                />
                {errors.yield_date && <span className="field-error">{errors.yield_date}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="health_condition">Health Condition</label>
                <input
                  id="health_condition"
                  name="health_condition"
                  type="text"
                  placeholder="Describe any health conditions"
                  value={formData.health_condition}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="button-group">
            {step === 2 && (
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                Back
              </button>
            )}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Processing..." : step === 1 ? "Continue" : "Complete Registration"}
            </button>
          </div>
        </form>
        
        <div className="signup-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
