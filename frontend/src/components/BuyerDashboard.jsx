// Enhanced BuyerDashboard.jsx
import React, { useState } from "react";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="buyer-dashboard">
      <header className="dashboard-header">
        <h1>Buyer Dashboard</h1>
        <p>Manage your shrimp purchases and pre-book harvest slots</p>
      </header>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === "overview" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={activeTab === "prebook" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("prebook")}
        >
          Pre-Book
        </button>
        <button 
          className={activeTab === "orders" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="tab-panel">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Upcoming Orders</h3>
                <p className="stat-number">3</p>
                <p className="stat-desc">Scheduled deliveries</p>
              </div>
              <div className="stat-card">
                <h3>Total Spent</h3>
                <p className="stat-number">$1,240</p>
                <p className="stat-desc">This month</p>
              </div>
              <div className="stat-card">
                <h3>Preferred Type</h3>
                <p className="stat-number">Tiger Prawns</p>
                <p className="stat-desc">Most ordered</p>
              </div>
            </div>
            
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <button className="book-btn">Pre-Book Harvest Slot</button>
              <button className="secondary-btn">View Order History</button>
            </div>
          </div>
        )}
        
        {activeTab === "prebook" && (
          <div className="tab-panel">
            <h2>Pre-Book Shrimp Harvest</h2>
            <p>Reserve your shrimp harvest in advance to ensure availability</p>
            <div className="booking-form">
              <div className="form-group">
                <label>Shrimp Type</label>
                <select>
                  <option>Tiger Prawns</option>
                  <option>White Prawns</option>
                  <option>Vannamei</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity (kg)</label>
                <input type="number" placeholder="Enter quantity" />
              </div>
              <div className="form-group">
                <label>Harvest Date</label>
                <input type="date" />
              </div>
              <button className="book-btn">Confirm Pre-Booking</button>
            </div>
          </div>
        )}
        
        {activeTab === "orders" && (
          <div className="tab-panel">
            <h2>Order History</h2>
            <p>Review your past and upcoming orders</p>
            <div className="orders-list">
              <div className="order-item">
                <h3>Order #12345</h3>
                <p>Tiger Prawns - 50kg</p>
                <p className="order-status">Scheduled for Oct 25, 2023</p>
              </div>
              <div className="order-item">
                <h3>Order #12346</h3>
                <p>White Prawns - 30kg</p>
                <p className="order-status delivered">Delivered on Oct 15, 2023</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;