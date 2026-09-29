import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTicket() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create ticket"
        );
      }

      navigate("/tickets");
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Something went wrong while creating the ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">

      {/* PAGE HEADER */}

      <div className="page-header create-ticket-header">

        <div>
          <div className="dashboard-eyebrow">
            SERVICE DESK
          </div>

          <h1 className="page-title">
            Create Ticket
          </h1>

          <p className="page-description">
            Submit a new IT service request and provide
            the details needed for support.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/tickets")}
        >
          ← Back to Tickets
        </button>

      </div>

      {/* CONTENT */}

      <div className="create-ticket-layout">

        {/* FORM */}

        <section className="create-ticket-card">

          <div className="create-card-heading">

            <div className="create-card-icon">
              +
            </div>

            <div>
              <h2>Service Request</h2>

              <p>
                Tell us what you need help with.
              </p>
            </div>

          </div>

          {error && (
            <div className="ticket-form-error">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* TITLE */}

            <div className="ticket-form-group">

              <label htmlFor="title">
                Ticket title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Unable to access company email"
                value={form.title}
                onChange={handleChange}
                required
              />

              <span className="field-help">
                Give your issue a short, descriptive title.
              </span>

            </div>

            {/* DESCRIPTION */}

            <div className="ticket-form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue, what happened, and any relevant details..."
                value={form.description}
                onChange={handleChange}
                rows="7"
                required
              />

              <span className="field-help">
                Include useful information that can help the
                support team understand the issue.
              </span>

            </div>

            {/* PRIORITY */}

            <div className="ticket-form-group">

              <label htmlFor="priority">
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
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

              <span className="field-help">
                Choose the level that best describes the
                urgency of your request.
              </span>

            </div>

            {/* ACTIONS */}

            <div className="ticket-form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/tickets")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Ticket →"}
              </button>

            </div>

          </form>

        </section>

        {/* INFORMATION PANEL */}

        <aside className="ticket-info-card">

          <div className="ticket-info-label">
            HOW IT WORKS
          </div>

          <h2>
            Get the right support,
            <span> faster.</span>
          </h2>

          <p>
            Once you submit your request, the support team
            can review, prioritize and assign it for
            resolution.
          </p>

          <div className="ticket-flow">

            <div className="ticket-flow-item">

              <div className="flow-number">
                01
              </div>

              <div>
                <strong>
                  Submit request
                </strong>

                <span>
                  Describe your IT issue clearly.
                </span>
              </div>

            </div>

            <div className="flow-line"></div>

            <div className="ticket-flow-item">

              <div className="flow-number">
                02
              </div>

              <div>
                <strong>
                  Support reviews
                </strong>

                <span>
                  Your request is prioritized and assigned.
                </span>
              </div>

            </div>

            <div className="flow-line"></div>

            <div className="ticket-flow-item">

              <div className="flow-number">
                03
              </div>

              <div>
                <strong>
                  Issue resolved
                </strong>

                <span>
                  Track progress until the ticket is resolved.
                </span>
              </div>

            </div>

          </div>

          <div className="ticket-status-note">
            <span className="status-indicator"></span>

            You can track your request from the Tickets
            workspace.
          </div>

        </aside>

      </div>

    </div>
  );
}

export default CreateTicket;