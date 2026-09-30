import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    role: "",
    password: "",
    confirmPassword: "",
    email: "",
    adminCode: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * OTP countdown timer.
   * 300 seconds = 5 minutes.
   */
  useEffect(() => {
    if (!otpSent || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const getErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    return fallback;
  };

  /*
   * Validate registration fields before sending OTP.
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (!/^[6-9][0-9]{9}$/.test(formData.mobileNumber)) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!formData.role) {
      return "Please select a role.";
    }

    if (!formData.password || formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      formData.role === "ADMIN" &&
      !formData.adminCode.trim()
    ) {
      return "Admin registration code is required.";
    }

    return null;
  };

  /*
   * First click:
   * Register user details and generate OTP.
   *
   * Later clicks:
   * Resend a new OTP.
   */
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoadingOtp(true);

      if (!otpSent) {
        /*
         * First OTP request.
         */
        await api.post("/auth/register", formData);

        setOtpSent(true);
        setTimeLeft(300);
        setOtp("");

        setSuccess(
          "OTP generated successfully. Enter the OTP below."
        );
      } else {
        /*
         * Resend OTP.
         */
        await api.post("/auth/resend-verification", {
          email: formData.email,
        });

        setTimeLeft(300);
        setOtp("");

        setSuccess(
          "A new OTP has been generated. Enter the new OTP below."
        );
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to generate OTP. Please try again."
        )
      );
    } finally {
      setLoadingOtp(false);
    }
  };

  /*
   * Verify OTP and finish account creation.
   */
  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!otpSent) {
      setError("Please click Send OTP first.");
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP has expired. Please click Resend OTP.");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoadingVerify(true);

      const response = await api.post(
        "/auth/verify-registration",
        {
          email: formData.email,
          otp: otp,
        }
      );

      /*
       * Save login information returned by backend.
       */
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);

      /*
       * Registration is complete.
       */
      navigate("/dashboard");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Invalid or expired OTP."
        )
      );
    } finally {
      setLoadingVerify(false);
    }
  };

  /*
   * Convert seconds into MM:SS.
   */
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
              <div className="auth-feature-icon">
                🎫
              </div>

              <div>
                <h3>Smart Ticket Management</h3>

                <p>
                  Create, track and manage IT service tickets
                  efficiently.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                👥
              </div>

              <div>
                <h3>Role-Based Access</h3>

                <p>
                  Employees, support agents and administrators
                  get appropriate access.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                🔐
              </div>

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


          {/* ERROR */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}
          {success && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "8px",
                background: "#ecfdf5",
                color: "#047857",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}


          <form onSubmit={handleVerify}>

            {/* FULL NAME */}
            <div className="auth-field">
              <label htmlFor="name">
                Full Name
              </label>

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


            {/* MOBILE NUMBER */}
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
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                required
              />
            </div>


            {/* ROLE */}
            <div className="auth-field">
              <label htmlFor="role">
                Select Role
              </label>

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
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength="8"
                required
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
                minLength="8"
                required
              />
            </div>


            {/* EMAIL */}
            <div className="auth-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>


            {/* OTP */}
            <div className="auth-field">

              <label htmlFor="otp">
                Email Verification OTP
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "stretch",
                }}
              >

                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  inputMode="numeric"
                  disabled={!otpSent}
                  style={{
                    flex: 1,
                  }}
                />

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loadingOtp}
                  style={{
                    minWidth: "125px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#0f766e",
                    color: "white",
                    fontWeight: "600",
                    cursor: loadingOtp
                      ? "not-allowed"
                      : "pointer",
                    padding: "0 14px",
                  }}
                >
                  {loadingOtp
                    ? "Please wait..."
                    : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </button>

              </div>


              {/* TIMER */}
              {otpSent && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color:
                      timeLeft > 60
                        ? "#475569"
                        : "#dc2626",
                    fontWeight: "500",
                  }}
                >
                  {timeLeft > 0
                    ? `OTP expires in ${formatTime()}`
                    : "OTP expired. Please resend OTP."}
                </div>
              )}

            </div>


            {/* VERIFY BUTTON */}
            <button
              type="submit"
              className="auth-submit-button"
              disabled={
                loadingVerify ||
                !otpSent ||
                timeLeft <= 0
              }
            >
              {loadingVerify
                ? "Verifying..."
                : "Verify OTP & Create Account"}
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