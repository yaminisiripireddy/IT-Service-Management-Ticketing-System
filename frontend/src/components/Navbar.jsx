import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <aside
        className={`app-sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "mobile-open" : ""}
        `}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">IT</div>

            <div className="brand-text">
              ServiceDesk
              <span className="brand-subtitle">
                Service Management
              </span>
            </div>
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            Workspace
          </div>

          <NavLink
            to="/dashboard"
            onClick={closeMobile}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">⌂</span>
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/tickets"
            onClick={closeMobile}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">▣</span>
            <span className="nav-label">Tickets</span>
          </NavLink>

          <NavLink
            to="/create-ticket"
            onClick={closeMobile}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">＋</span>
            <span className="nav-label">Create Ticket</span>
          </NavLink>

          {userRole === "ADMIN" && (
            <>
              <div
                className="nav-section-title"
                style={{ marginTop: "24px" }}
              >
                Administration
              </div>

              <NavLink
                to="/users"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">♙</span>
                <span className="nav-label">Users</span>
              </NavLink>
            </>
          )}

          <div
            className="nav-section-title"
            style={{ marginTop: "24px" }}
          >
            Account
          </div>

          <NavLink
            to="/profile"
            onClick={closeMobile}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">◎</span>
            <span className="nav-label">Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <span className="nav-icon">↪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;