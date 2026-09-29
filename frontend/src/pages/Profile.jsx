import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "Not available";
  const role = localStorage.getItem("role") || "EMPLOYEE";
  const userId = localStorage.getItem("userId") || "—";

  const getInitial = () => {
    return name.charAt(0).toUpperCase();
  };

  const formatRole = () => {
    if (role === "SUPPORT_AGENT") {
      return "Support Agent";
    }

    if (role === "ADMIN") {
      return "Administrator";
    }

    return "Employee";
  };

  return (
    <div className="profile-page">

      <div className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>
            View your account information and access details.
          </p>
        </div>
      </div>

      <div className="profile-layout">

        <div className="profile-card profile-main-card">

          <div className="profile-cover"></div>

          <div className="profile-main-content">

            <div className="profile-avatar">
              {getInitial()}
            </div>

            <div className="profile-identity">
              <h2>{name}</h2>
              <p>{email}</p>

              <span className="profile-role-badge">
                {formatRole()}
              </span>
            </div>

          </div>

          <div className="profile-divider"></div>

          <div className="profile-information">

            <div className="profile-info-item">
              <span className="profile-info-label">
                Full Name
              </span>

              <strong>{name}</strong>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Email Address
              </span>

              <strong>{email}</strong>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Account Role
              </span>

              <strong>{formatRole()}</strong>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                User ID
              </span>

              <strong>#{userId}</strong>
            </div>

          </div>

        </div>

        <div className="profile-side-column">

          <div className="profile-card profile-security-card">

            <div className="profile-card-heading">
              <div className="profile-card-icon">
                ✓
              </div>

              <div>
                <h3>Account Status</h3>
                <p>Your account is active.</p>
              </div>
            </div>

            <div className="profile-status">
              <span className="profile-status-dot"></span>
              Active
            </div>

          </div>

          <div className="profile-card profile-help-card">

            <div className="profile-card-heading">
              <div className="profile-card-icon">
                ?
              </div>

              <div>
                <h3>Need Help?</h3>
                <p>
                  Create a support ticket if you
                  need assistance.
                </p>
              </div>
            </div>

            <button
              className="profile-ticket-button"
              onClick={() => navigate("/create-ticket")}
            >
              Create Support Ticket
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;