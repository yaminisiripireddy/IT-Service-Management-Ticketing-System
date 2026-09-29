import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:8080/api/tickets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTickets(response.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Unable to load tickets."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        ticket.title?.toLowerCase().includes(searchText) ||
        ticket.description?.toLowerCase().includes(searchText) ||
        ticket.createdByName?.toLowerCase().includes(searchText) ||
        ticket.assignedToName?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "ticket-status-open";

      case "IN_PROGRESS":
        return "ticket-status-progress";

      case "RESOLVED":
        return "ticket-status-resolved";

      case "CLOSED":
        return "ticket-status-closed";

      default:
        return "";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "LOW":
        return "ticket-priority-low";

      case "MEDIUM":
        return "ticket-priority-medium";

      case "HIGH":
        return "ticket-priority-high";

      case "CRITICAL":
        return "ticket-priority-critical";

      default:
        return "";
    }
  };

  return (
    <div className="tickets-page">

      {/* PAGE HEADER */}

      <div className="tickets-page-header">

        <div>
          <h1 className="page-title">
            Tickets
          </h1>

          <p className="page-description">
            View and manage service requests.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/create-ticket")}
        >
          <span>＋</span>
          Create Ticket
        </button>

      </div>

      {/* FILTER BAR */}

      <div className="tickets-toolbar">

        <div className="tickets-search">

          <span className="tickets-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="tickets-filter"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
          className="tickets-filter"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

      </div>

      {/* TICKET CONTENT */}

      <div className="tickets-card">

        <div className="tickets-card-header">

          <div>
            <h2>Service Requests</h2>

            <p>
              {filteredTickets.length} ticket
              {filteredTickets.length !== 1 ? "s" : ""}
              {" "}found
            </p>
          </div>

          <div className="tickets-total">
            Total {tickets.length}
          </div>

        </div>

        {loading && (
          <div className="tickets-state">
            <div className="tickets-loader"></div>
            <p>Loading tickets...</p>
          </div>
        )}

        {!loading && error && (
          <div className="tickets-state tickets-error-state">
            <div className="tickets-state-icon">
              !
            </div>

            <h3>Unable to load tickets</h3>

            <p>{error}</p>

            <button
              className="secondary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredTickets.length === 0 && (
            <div className="tickets-state">

              <div className="tickets-empty-icon">
                ▣
              </div>

              <h3>
                No tickets found
              </h3>

              <p>
                {tickets.length === 0
                  ? "Create your first service ticket to get started."
                  : "Try changing your search or filters."}
              </p>

              {tickets.length === 0 && (
                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("/create-ticket")
                  }
                >
                  Create Ticket
                </button>
              )}

            </div>
          )}

        {!loading &&
          !error &&
          filteredTickets.length > 0 && (
            <div className="tickets-table-wrapper">

              <table className="tickets-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ticket</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created By</th>
                    <th>Assigned To</th>
                    <th>Updated</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() =>
                        navigate(
                          `/tickets/${ticket.id}`
                        )
                      }
                    >

                      <td>
                        <span className="ticket-id">
                          #{ticket.id}
                        </span>
                      </td>

                      <td>
                        <div className="ticket-title-cell">

                          <strong>
                            {ticket.title}
                          </strong>

                          <span>
                            {ticket.description
                              ? ticket.description.length > 75
                                ? `${ticket.description.substring(
                                    0,
                                    75
                                  )}...`
                                : ticket.description
                              : "No description"}
                          </span>

                        </div>
                      </td>

                      <td>
                        <span
                          className={`ticket-status-badge ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status
                            ?.replace("_", " ")}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ticket-priority-badge ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          <span className="priority-dot"></span>
                          {ticket.priority}
                        </span>
                      </td>

                      <td>
                        <div className="ticket-person">
                          <div className="ticket-person-avatar">
                            {ticket.createdByName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <span>
                            {ticket.createdByName || "-"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {ticket.assignedToName ? (
                          <div className="ticket-person">

                            <div className="ticket-person-avatar assigned">
                              {ticket.assignedToName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              {ticket.assignedToName}
                            </span>

                          </div>
                        ) : (
                          <span className="unassigned-text">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="ticket-date">
                          {formatDate(ticket.updatedAt)}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

      </div>
    </div>
  );
}

export default Tickets;