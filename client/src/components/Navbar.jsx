import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "../styles/components/navbar.css";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <nav className="navbar glass-card">
      <div className="container navbar-inner">
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => setMobileOpen(false)}
        >
          <img
            className="brand-logo"
            src="/assets/logo.png"
            alt="LeadDesk Mini logo"
          />
          <span className="brand-text">LeadDesk Mini</span>
        </Link>
        <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="navbar-actions">
          <ThemeToggle />
          {isAuthenticated && (
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          )}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
