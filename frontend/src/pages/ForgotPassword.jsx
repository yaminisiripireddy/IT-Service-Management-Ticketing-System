import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );

      setMessage(
        "OTP sent. Check the backend console for the OTP."
      );

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to process request."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-container">

          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="auth-field">
              <label>Email Address</label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
            >
              Send OTP
            </button>

          </form>

          <button
            className="auth-secondary-link"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;