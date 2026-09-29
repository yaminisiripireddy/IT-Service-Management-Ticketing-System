import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const currentUserId = Number(localStorage.getItem("userId"));

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const canManage =
    role === "SUPPORT_AGENT" || role === "ADMIN";

  const canClose =
    role === "EMPLOYEE" &&
    ticket &&
    ticket.createdById === currentUserId &&
    ticket.status === "RESOLVED";

  // =========================================================
  // LOAD TICKET
  // =========================================================

  const loadTicket = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tickets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicket(response.data);
      setStatus(response.data.status);
      setPriority(response.data.priority);
      setAssignedTo(response.data.assignedToId || "");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load ticket."
      );
    }
  };

  // =========================================================
  // LOAD COMMENTS
  // =========================================================

  const loadComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tickets/${id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // LOAD SUPPORT AGENTS
  // =========================================================

  const loadAgents = async () => {
    if (!canManage) {
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/users/agents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // LOAD PAGE DATA
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await loadTicket();
      await loadComments();
      await loadAgents();

      setLoading(false);
    };

    loadData();
  }, [id]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // STATUS UPDATE
  // =========================================================

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      setActionMessage("");

      const response = await axios.put(
        `http://localhost:8080/api/tickets/${id}/status?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicket(response.data);
      setStatus(response.data.status);

      setActionMessage(
        "Ticket status updated successfully."
      );
    } catch (err) {
      console.error(err);

      setActionMessage(
        err.response?.data?.message ||
          "Unable to update status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // PRIORITY UPDATE
  // =========================================================

  const handlePriorityChange = async (newPriority) => {
    try {
      setActionLoading(true);
      setActionMessage("");

      const response = await axios.put(
        `http://localhost:8080/api/tickets/${id}/priority?priority=${newPriority}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicket(response.data);
      setPriority(response.data.priority);

      setActionMessage(
        "Ticket priority updated successfully."
      );
    } catch (err) {
      console.error(err);

      setActionMessage(
        err.response?.data?.message ||
          "Unable to update priority."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // ASSIGN TICKET
  // =========================================================

  const handleAssign = async (value) => {
    setAssignedTo(value);

    if (!value) {
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage("");

      const response = await axios.put(
        `http://localhost:8080/api/tickets/${id}/assign?userId=${value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicket(response.data);

      setActionMessage(
        "Ticket assigned successfully."
      );
    } catch (err) {
      console.error(err);

      setActionMessage(
        err.response?.data?.message ||
          "Unable to assign ticket."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // CLOSE TICKET
  // =========================================================

  const handleCloseTicket = async () => {
    try {
      setActionLoading(true);
      setActionMessage("");

      const response = await axios.put(
        `http://localhost:8080/api/tickets/${id}/close`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicket(response.data);
      setStatus(response.data.status);

      setActionMessage(
        "Ticket closed successfully."
      );
    } catch (err) {
      console.error(err);

      setActionMessage(
        err.response?.data?.message ||
          "Unable to close ticket."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // ADD COMMENT
  // =========================================================

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      await axios.post(
        `http://localhost:8080/api/tickets/${id}/comments`,
        {
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");

      await loadComments();
    } catch (err) {
      console.error(err);

      setActionMessage(
        err.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="ticket-details-state">
        <div className="ticket-details-loader"></div>

        <p>Loading ticket...</p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !ticket) {
    return (
      <div className="ticket-details-state">
        <div className="ticket-details-state-icon">
          !
        </div>

        <h3>Unable to load ticket</h3>

        <p>
          {error || "Ticket was not found."}
        </p>

        <button
          className="secondary-button"
          onClick={() => navigate("/tickets")}
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="ticket-details-page">

      {/* HEADER */}

      <div className="ticket-details-header">

        <div>
          <button
            className="ticket-back-button"
            onClick={() => navigate("/tickets")}
          >
            ← Back to Tickets
          </button>

          <div className="ticket-details-title-row">

            <div>
              <div className="ticket-details-id">
                Ticket #{ticket.id}
              </div>

              <h1 className="page-title">
                {ticket.title}
              </h1>

              <p className="page-description">
                Service request details and activity.
              </p>
            </div>

          </div>
        </div>

        <div className="ticket-details-header-status">

          <span
            className={`ticket-status-badge ${
              ticket.status === "OPEN"
                ? "ticket-status-open"
                : ticket.status === "IN_PROGRESS"
                  ? "ticket-status-progress"
                  : ticket.status === "RESOLVED"
                    ? "ticket-status-resolved"
                    : "ticket-status-closed"
            }`}
          >
            {ticket.status.replace("_", " ")}
          </span>

        </div>

      </div>

      {/* ACTION MESSAGE */}

      {actionMessage && (
        <div className="ticket-action-message">
          {actionMessage}
        </div>
      )}

      {/* MAIN GRID */}

      <div className="ticket-details-layout">

        {/* LEFT SIDE */}

        <div className="ticket-details-main">

          {/* DESCRIPTION */}

          <section className="ticket-details-card">

            <div className="ticket-details-card-heading">

              <div>
                <h2>Description</h2>

                <p>
                  Information provided with the
                  service request.
                </p>
              </div>

            </div>

            <div className="ticket-description">
              {ticket.description}
            </div>

          </section>

          {/* COMMENTS */}

          <section className="ticket-details-card">

            <div className="ticket-details-card-heading">

              <div>
                <h2>Activity & Comments</h2>

                <p>
                  Communication related to this ticket.
                </p>
              </div>

              <span className="ticket-comment-count">
                {comments.length}
              </span>

            </div>

            <div className="ticket-comments">

              {comments.length === 0 ? (
                <div className="ticket-no-comments">
                  No comments yet.
                </div>
              ) : (
                comments.map((item) => (
                  <div
                    className="ticket-comment"
                    key={item.id}
                  >

                    <div className="ticket-comment-avatar">
                      {item.userName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="ticket-comment-content">

                      <div className="ticket-comment-top">

                        <strong>
                          {item.userName}
                        </strong>

                        <span>
                          {item.userRole?.replace(
                            "_",
                            " "
                          )}
                        </span>

                        <time>
                          {formatDate(
                            item.createdAt
                          )}
                        </time>

                      </div>

                      <p>
                        {item.comment}
                      </p>

                    </div>

                  </div>
                ))
              )}

            </div>

            {/* ADD COMMENT */}

            <form
              className="ticket-comment-form"
              onSubmit={handleAddComment}
            >

              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                rows="4"
              />

              <div className="ticket-comment-actions">

                <span>
                  Keep communication clear and
                  relevant to the service request.
                </span>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    commentLoading ||
                    !comment.trim()
                  }
                >
                  {commentLoading
                    ? "Posting..."
                    : "Add Comment"}
                </button>

              </div>

            </form>

          </section>

        </div>

        {/* RIGHT SIDE */}

        <aside className="ticket-details-side">

          {/* INFORMATION */}

          <section className="ticket-details-card">

            <div className="ticket-details-card-heading">

              <div>
                <h2>Ticket Information</h2>

                <p>
                  Current ticket state.
                </p>
              </div>

            </div>

            <div className="ticket-info-list">

              <div className="ticket-info-row">
                <span>Status</span>

                <strong>
                  {ticket.status.replace("_", " ")}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Priority</span>

                <strong>
                  {ticket.priority}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Created By</span>

                <strong>
                  {ticket.createdByName}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Assigned To</span>

                <strong>
                  {ticket.assignedToName ||
                    "Unassigned"}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Created</span>

                <strong>
                  {formatDate(
                    ticket.createdAt
                  )}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Updated</span>

                <strong>
                  {formatDate(
                    ticket.updatedAt
                  )}
                </strong>
              </div>

            </div>

          </section>

          {/* MANAGEMENT */}

          {canManage && (
            <section className="ticket-details-card">

              <div className="ticket-details-card-heading">

                <div>
                  <h2>Manage Ticket</h2>

                  <p>
                    Update service request workflow.
                  </p>
                </div>

              </div>

              <div className="ticket-management-form">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  disabled={actionLoading}
                  onChange={(event) => {
                    setStatus(event.target.value);

                    handleStatusChange(
                      event.target.value
                    );
                  }}
                >
                  <option value="OPEN">
                    Open
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="RESOLVED">
                    Resolved
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>

                <label>
                  Priority
                </label>

                <select
                  value={priority}
                  disabled={actionLoading}
                  onChange={(event) => {
                    setPriority(event.target.value);

                    handlePriorityChange(
                      event.target.value
                    );
                  }}
                >
                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                  <option value="CRITICAL">
                    Critical
                  </option>
                </select>

                <label>
                  Assign Support Agent
                </label>

                <select
                  value={assignedTo}
                  disabled={actionLoading}
                  onChange={(event) =>
                    handleAssign(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Unassigned
                  </option>

                  {agents.map((agent) => (
                    <option
                      key={agent.id}
                      value={agent.id}
                    >
                      {agent.name}
                    </option>
                  ))}
                </select>

              </div>

            </section>
          )}

          {/* EMPLOYEE CLOSE */}

          {canClose && (
            <section className="ticket-close-card">

              <div className="ticket-close-icon">
                ✓
              </div>

              <div>

                <h3>
                  Ticket resolved
                </h3>

                <p>
                  If your issue has been resolved,
                  you can close this ticket.
                </p>

              </div>

              <button
                className="primary-button"
                disabled={actionLoading}
                onClick={handleCloseTicket}
              >
                {actionLoading
                  ? "Closing..."
                  : "Close Ticket"}
              </button>

            </section>
          )}

        </aside>

      </div>

    </div>
  );
}

export default TicketDetails;