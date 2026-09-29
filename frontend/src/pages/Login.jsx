import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
        const responseData = err.response?.data;

        let errorMessage = "Unable to login. Please try again.";

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (err.response?.status === 500) {
          errorMessage = "Server error. Please check that the backend is running correctly.";
        } else if (err.response?.status === 401) {
          errorMessage = "Invalid email or password.";
        }

        setError(errorMessage);
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
            IT
          </div>

          <h1>IT Service Management</h1>

          <p className="auth-brand-subtitle">
            Manage IT support requests, track incidents, and resolve
            technical issues efficiently.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div>
                <h3>Track Support Tickets</h3>
                <p>
                  Create and monitor IT service requests from one place.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div>
                <h3>Faster Issue Resolution</h3>
                <p>
                  Connect employees with support agents and track progress.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div>
                <h3>Centralized Management</h3>
                <p>
                  Manage tickets, priorities, assignments, and statuses.
                </p>
              </div>
            </div>

          </div>

          <div className="auth-brand-footer">
            Secure • Reliable • Efficient IT Support
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-panel">
        <div className="auth-form-container">

          <div className="auth-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="auth-field">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <div className="auth-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-forgot-row">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          <div className="auth-register-link">
            <span>Don't have an account?</span>{" "}
            <Link to="/register">Create an account</Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;