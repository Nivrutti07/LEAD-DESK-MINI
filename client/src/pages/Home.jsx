import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { leadsApi } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const scrollTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  const validateForm = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Full name is required";
    else if (formData.name.trim().length < 3)
      next.name = "Name must be at least 3 characters";
    if (!formData.email) next.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      next.email = "Enter a valid email address";
    if (!formData.budget) next.budget = "Please choose a budget range";
    if (!formData.message.trim())
      next.message = "Tell us a little about your requirement";
    else if (formData.message.trim().length < 10)
      next.message = "Message must be at least 10 characters";
    return next;
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await leadsApi.create({ ...formData, status: "New" });
      setSuccess("Thanks! Your lead has been submitted successfully.");
      setFormData({ name: "", email: "", budget: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We could not submit your lead. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="landing-page">
      <div className="container landing-container">
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <span className="hero-badge">
              <span className="status-dot" /> Modern Lead CRM
            </span>
            <h1>
              Capture Leads.
              <br />
              Manage Customers.
              <br />
              <span>Grow Faster.</span>
            </h1>
            <p>
              LeadDesk Mini helps businesses collect customer inquiries,
              organize leads, and track conversions from one simple dashboard.
            </p>
            <div className="hero-cta">
              <Button variant="primary" onClick={() => scrollTo("lead-form")}>
                Get Started <span aria-hidden="true">→</span>
              </Button>
              {isAuthenticated && (
                <Button
                  variant="secondary"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  View Dashboard
                </Button>
              )}
            </div>
            <small className="hero-trust">
              <span aria-hidden="true">✦</span> Built for modern businesses that
              value faster customer connections.
            </small>
          </div>
          <div className="dashboard-preview glass-card">
            <div className="preview-top">
              <div>
                <span className="preview-kicker">OVERVIEW</span>
                <h3>LeadDesk Dashboard</h3>
              </div>
              <span className="preview-dots">•••</span>
            </div>
            <div className="metrics-grid">
              {[
                ["250", "Total Leads"],
                ["120", "New Leads"],
                ["80", "Contacted"],
                ["50", "Closed"],
              ].map(([count, label], index) => (
                <div className="metric" key={label}>
                  <span className={`metric-icon metric-${index}`}>↗</span>
                  <strong>{count}</strong>
                  <small>{label}</small>
                </div>
              ))}
            </div>
            <div className="preview-activity">
              <span>Recent activity</span>
              <span className="activity-line" />
              <span className="activity-dot" />
            </div>
          </div>
        </section>
        <section className="lead-capture-section" id="lead-form">
          <div className="section-intro">
            <span className="eyebrow">LET'S GET STARTED</span>
            <h2>
              Ready to Convert Your
              <br />
              Visitors Into Customers?
            </h2>
            <p>Share your details and our team will get back to you.</p>
          </div>
          <div className="lead-form-card glass-card">
            {success && (
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            )}
            {error && (
              <Alert
                type="danger"
                message={error}
                onClose={() => setError("")}
              />
            )}
            <form
              onSubmit={handleSubmit}
              className="lead-submit-form"
              noValidate
            >
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="you"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <div className="input-group">
                <label className="input-label" htmlFor="budget">
                  Budget Range <span className="required">*</span>
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select budget range</option>
                  <option value="Under ₹10,000">Under ₹10,000</option>
                  <option value="₹10,000 - ₹50,000">₹10,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">
                    ₹50,000 - ₹1,00,000
                  </option>
                  <option value="Above ₹1,00,000">Above ₹1,00,000</option>
                </select>
                {errors.budget && (
                  <span className="input-error-text">{errors.budget}</span>
                )}
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your requirement"
                  value={formData.message}
                  onChange={handleChange}
                  className="input-field"
                  rows="4"
                />
                {errors.message && (
                  <span className="input-error-text">{errors.message}</span>
                )}
              </div>
              <Button type="submit" fullWidth loading={loading}>
                Submit Lead <span aria-hidden="true">→</span>
              </Button>
            </form>
          </div>
        </section>
      </div>
      <footer className="site-footer">
        <div className="container footer-inner">
          <strong>
            LeadDesk <span>Mini</span>
          </strong>
          <p>
            Built for{" "}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noreferrer"
            >
              Digital Heroes Training Task
            </a>
          </p>
          <div></div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
