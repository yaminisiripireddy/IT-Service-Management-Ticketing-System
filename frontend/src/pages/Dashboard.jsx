import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    criticalTickets: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const [statsResponse, ticketsResponse] = await Promise.all([
        fetch("http://localhost:8080/api/dashboard/statistics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("http://localhost:8080/api/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (ticketsResponse.ok) {
        const ticketData = await ticketsResponse.json();
        setTickets(ticketData.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (value) => {
    if (!value) return "U";

    return value
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-welcome">

        <div>
          <div className="dashboard-eyebrow">
            SERVICE DESK
          </div>

          <h1 className="dashboard-title">
            Good to see you, {name.split(" ")[0]}
          </h1>

          <p className="dashboard-subtitle">
            Here's what's happening with your service requests today.
          </p>
        </div>

        <button
          className="primary-button dashboard-create-button"
          onClick={() => navigate("/create-ticket")}
        >
          <span>＋</span>
          Create Ticket
        </button>

      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon purple">
              #
            </div>

            <span className="stat-label">
              Total Tickets
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : stats.totalTickets}
          </div>

          <div className="stat-description">
            All service requests
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue">
              ◷
            </div>

            <span className="stat-label">
              Open
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : stats.openTickets}
          </div>

          <div className="stat-description">
            Awaiting action
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon orange">
              ↻
            </div>

            <span className="stat-label">
              In Progress
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : stats.inProgressTickets}
          </div>

          <div className="stat-description">
            Currently being handled
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon green">
              ✓
            </div>

            <span className="stat-label">
              Resolved
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : stats.resolvedTickets}
          </div>

          <div className="stat-description">
            Successfully resolved
          </div>
        </div>

      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-content-grid">

        {/* Recent tickets */}
        <section className="dashboard-panel recent-panel">

          <div className="panel-header">

            <div>
              <h2 className="panel-title">
                Recent Tickets
              </h2>

              <p className="panel-description">
                Latest service requests
              </p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/tickets")}
            >
              View all →
            </button>

          </div>

          {loading ? (
            <div className="empty-state">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                No tickets yet
              </h3>

              <p>
                Create your first service request to get started.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/create-ticket")}
              >
                Create Ticket
              </button>

            </div>
          ) : (
            <div className="ticket-table-wrapper">

              <table className="ticket-table">

                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created By</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() =>
                        navigate(`/tickets/${ticket.id}`)
                      }
                    >

                      <td>
                        <div className="ticket-title-cell">

                          <div className="ticket-number">
                            #{ticket.id}
                          </div>

                          <div>
                            <div className="ticket-row-title">
                              {ticket.title}
                            </div>

                            <div className="ticket-row-description">
                              {ticket.description?.substring(0, 45)}
                              {ticket.description?.length > 45
                                ? "..."
                                : ""}
                            </div>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${ticket.status
                            ?.toLowerCase()
                            .replace("_", "-")}`}
                        >
                          <span className="status-dot"></span>
                          {ticket.status?.replace("_", " ")}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`priority-badge ${ticket.priority?.toLowerCase()}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td>
                        <div className="creator-cell">

                          <div className="creator-avatar">
                            {getInitials(ticket.createdByName)}
                          </div>

                          <span>
                            {ticket.createdByName}
                          </span>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* Right column */}
        <div className="dashboard-side-column">

          {/* Critical tickets */}
          <section className="dashboard-panel critical-panel">

            <div className="panel-header">

              <div>
                <h2 className="panel-title">
                  Attention
                </h2>

                <p className="panel-description">
                  Requires priority handling
                </p>
              </div>

              <div className="attention-icon">
                !
              </div>

            </div>

            <div className="critical-number">
              {loading ? "—" : stats.criticalTickets}
            </div>

            <div className="critical-label">
              Critical tickets
            </div>

            <button
              className="attention-button"
              onClick={() => navigate("/tickets")}
            >
              Review tickets
              <span>→</span>
            </button>

          </section>

          {/* Status overview */}
          <section className="dashboard-panel">

            <div className="panel-header">
              <div>
                <h2 className="panel-title">
                  Status Overview
                </h2>

                <p className="panel-description">
                  Current ticket distribution
                </p>
              </div>
            </div>

            <div className="status-overview">

              <div className="overview-row">
                <div className="overview-label">
                  <span className="overview-dot open"></span>
                  Open
                </div>

                <strong>
                  {stats.openTickets}
                </strong>
              </div>

              <div className="overview-row">
                <div className="overview-label">
                  <span className="overview-dot progress"></span>
                  In Progress
                </div>

                <strong>
                  {stats.inProgressTickets}
                </strong>
              </div>

              <div className="overview-row">
                <div className="overview-label">
                  <span className="overview-dot resolved"></span>
                  Resolved
                </div>

                <strong>
                  {stats.resolvedTickets}
                </strong>
              </div>

              <div className="overview-row">
                <div className="overview-label">
                  <span className="overview-dot closed"></span>
                  Closed
                </div>

                <strong>
                  {stats.closedTickets}
                </strong>
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;