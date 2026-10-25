// components/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginFarmer } from "../api/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedPhone = formData.phone.trim();
    
    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(trimmedPhone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const trimmedPhone = formData.phone.trim();
      const res = await loginFarmer(trimmedPhone, formData.password);
      
      const token = res.token || res.access_token;
      const role = res.role || "farmer";

      // Store authentication data in localStorage and sessionStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userPhone", trimmedPhone);
      if (res.user?.name) localStorage.setItem("userName", res.user.name);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      if (res.user?.name) sessionStorage.setItem("userName", res.user.name);

      // Show success message
      setErrors({ success: "Login successful! Redirecting..." });
      
      // Redirect based on role after a brief delay
      setTimeout(() => {
        if (role === "buyer") {
          navigate("/buyer-dashboard");
        } else {
          navigate("/farmer-dashboard");
        }
      }, 1000);
      
    } catch (err) {
      console.error("Login failed", err);
      const detail = err.response?.data?.detail;
      const message = typeof detail === "string" 
        ? detail 
        : err.response?.data?.message || "Login failed. Please check your credentials.";
      setErrors({ 
        submit: message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    setErrors({});
    setFormData({
      phone: role === "farmer" ? "9876543210" : "9123456780",
      password: "demo123"
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🦐</span>
            <span className="logo-text">Farm Fresh Aqua</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>

        {/* Demo Account Buttons */}
        <div className="demo-buttons">
          <p>Try demo accounts:</p>
          <div className="demo-btns">
            <button 
              type="button" 
              className="demo-btn farmer-demo"
              onClick={() => handleDemoLogin("farmer")}
            >
              Farmer Demo
            </button>
            <button 
              type="button" 
              className="demo-btn buyer-demo"
              onClick={() => handleDemoLogin("buyer")}
            >
              Buyer Demo
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="login-form">
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}
          
          {errors.success && (
            <div className="success-message">
              {errors.success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-with-icon">
              <span className="input-prefix">+91</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit phone number"
                className={errors.phone ? "error" : ""}
                maxLength="10"
              />
            </div>
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Or</span>
        </div>

        {/* Social Login Options */}
        <div className="social-login">
          <p>Sign in with</p>
          <div className="social-buttons">
            <button type="button" className="social-btn google-btn">
              <span className="social-icon">📱</span>
              SMS
            </button>
            <button type="button" className="social-btn otp-btn">
              <span className="social-icon">🔐</span>
              OTP
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign up now</Link></p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="login-decoration">
        <div className="decoration-item item-1">🦐</div>
        <div className="decoration-item item-2">🐟</div>
        <div className="decoration-item item-3">🌊</div>
      </div>
    </div>
  );
};

export default Login;
