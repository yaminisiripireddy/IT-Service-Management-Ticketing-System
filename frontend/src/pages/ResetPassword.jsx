import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
          confirmPassword,
        }
      );

      setMessage(
        "Password reset successfully. Redirecting..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to reset password."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-container">

          <h1>Reset Password</h1>

          <p>
            Reset password for:
          </p>

          <strong>{email}</strong>

          <form onSubmit={handleSubmit}>

            <div className="auth-field">
              <label>OTP</label>

              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="6-digit OTP"
                required
              />
            </div>

            <div className="auth-field">
              <label>New Password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                required
              />
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
            >
              Reset Password
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;