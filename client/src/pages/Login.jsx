import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import "../styles/pages/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      setAlertMessage("Login successful!");
      setAlertType("success");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (err) {
      setAlertMessage(err.response?.data?.message || "Login failed");
      setAlertType("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card glass-card">
        <Link to="/" className="auth-brand">
          <img src="/assets/logo.png" alt="" />
          <span>LeadDesk Mini</span>
        </Link>
        <div className="auth-header">
          <span className="auth-kicker">WELCOME BACK</span>
          <h1>Sign in to your workspace</h1>
          <p>Access your admin workspace</p>
        </div>

        {alertMessage && (
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setAlertMessage("")}
          />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder=""
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Sign in
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Forgot password? <span className="auth-link">Contact support</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
