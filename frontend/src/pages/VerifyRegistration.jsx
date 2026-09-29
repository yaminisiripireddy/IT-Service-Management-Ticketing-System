import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8080/api/auth/verify-registration",
        {
          email,
          otp,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">

      {/* LEFT SHOWCASE */}
      <section className="auth-showcase">
        <div className="showcase-content">

          <div className="product-brand">
            <div className="product-logo">
              IT
            </div>

            <div>
              <div className="product-name">
                ServiceDesk
              </div>

              <div className="product-tagline">
                SERVICE MANAGEMENT PLATFORM
              </div>
            </div>
          </div>

          <div className="showcase-heading">

            <div className="showcase-label">
              ACCOUNT SECURITY
            </div>

            <h1>
              Verify your
              <span> account.</span>
            </h1>

            <p>
              Complete your account verification to securely
              access the IT Service Management platform.
            </p>

          </div>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon ticket-feature">
                ✓
              </div>

              <div>
                <strong>
                  Secure Verification
                </strong>

                <span>
                  Confirm your identity before accessing
                  your ServiceDesk account.
                </span>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon security-feature">
                #
              </div>

              <div>
                <strong>
                  One-Time Password
                </strong>

                <span>
                  Enter the 6-digit verification code
                  sent to your registered email.
                </span>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon analytics-feature">
                IT
              </div>

              <div>
                <strong>
                  IT Service Management
                </strong>

                <span>
                  Manage tickets, support requests and
                  service operations from one platform.
                </span>
              </div>
            </div>

          </div>

          <div className="showcase-footer">
            <span className="status-indicator"></span>
            Secure service management environment
          </div>

        </div>
      </section>

      {/* RIGHT FORM */}
      <section className="auth-form-section">

        <div className="auth-card-modern">

          <div className="auth-heading-modern">

            <h2>
              Verify Your Account
            </h2>

            <p>
              Enter the 6-digit OTP sent to your
              registered email address.
            </p>

          </div>

          {error && (
            <div className="auth-error-modern">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={verifyOtp}>

            <div className="modern-form-group">

              <label>
                Registered Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  type="email"
                  value={email}
                  readOnly
                />

              </div>

            </div>

            <div className="modern-form-group">

              <label>
                Verification OTP
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  #
                </span>

                <input
                  type="text"
                  value={otp}
                  maxLength="6"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  required
                />

              </div>

              <div className="password-hint">
                The verification code is valid for 10 minutes.
              </div>

            </div>

            <button
              type="submit"
              className="auth-primary-button"
              disabled={loading}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify Account
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
            <span></span>
            <small>ACCOUNT SECURITY</small>
            <span></span>
          </div>

          <div className="auth-register-text">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                marginLeft: "5px",
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#0f766e",
                fontFamily: "inherit",
                fontSize: "12px",
                fontWeight: "750",
                cursor: "pointer"
              }}
            >
              Back to Login
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}

export default VerifyRegistration;