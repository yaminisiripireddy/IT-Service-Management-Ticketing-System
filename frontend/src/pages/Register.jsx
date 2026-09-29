import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    adminCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    if (formData.role === "ADMIN" && !formData.adminCode.trim()) {
      setError("Admin registration code is required.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      navigate(
        `/verify-registration?email=${encodeURIComponent(
          formData.email
        )}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">

      {/* LEFT SIDE */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">

          <div className="auth-brand-icon">
            🛠️
          </div>

          <h1>IT Service Management</h1>

          <p className="auth-brand-subtitle">
            Manage IT support requests, incidents and service
            operations from one centralized platform.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <div className="auth-feature-icon">🎫</div>
              <div>
                <h3>Smart Ticket Management</h3>
                <p>
                  Create, track and manage IT service tickets
                  efficiently.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">👥</div>
              <div>
                <h3>Role-Based Access</h3>
                <p>
                  Employees, support agents and administrators
                  get appropriate access.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">🔐</div>
              <div>
                <h3>Secure Authentication</h3>
                <p>
                  JWT authentication, password encryption and
                  OTP verification.
                </p>
              </div>
            </div>

          </div>

          <div className="auth-brand-footer">
            IT Service Management System
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-panel">
        <div className="auth-form-container">

          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>
              Register to access the IT Service Management
              platform.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* MOBILE */}
            <div className="auth-field">
              <label htmlFor="mobileNumber">
                Mobile Number
              </label>

              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                required
              />
            </div>

            {/* ROLE */}
            <div className="auth-field">
              <label htmlFor="role">Select Role</label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="auth-select"
              >
                <option value="">
                  Select your role
                </option>

                <option value="EMPLOYEE">
                  Employee
                </option>

                <option value="SUPPORT_AGENT">
                  Support Agent
                </option>

                <option value="ADMIN">
                  Administrator
                </option>
              </select>
            </div>

            {/* ADMIN CODE */}
            {formData.role === "ADMIN" && (
              <div className="auth-field">
                <label htmlFor="adminCode">
                  Admin Registration Code
                </label>

                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Enter Admin registration code"
                  required
                />

                <small className="auth-helper-text">
                  Admin registration requires an authorized
                  registration code.
                </small>
              </div>
            )}

            {/* PASSWORD */}
            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                minLength="8"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="auth-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                minLength="8"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-register-link">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;