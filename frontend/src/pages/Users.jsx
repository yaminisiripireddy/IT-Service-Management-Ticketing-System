import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      setUpdatingId(userId);
      setError("");

      await axios.put(
        `http://localhost:8080/api/users/${userId}/role?role=${role}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, role }
            : user
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update user role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const getRoleClass = (role) => {
    if (role === "ADMIN") {
      return "users-role-admin";
    }

    if (role === "SUPPORT_AGENT") {
      return "users-role-agent";
    }

    return "users-role-employee";
  };

  return (
    <div className="users-page">

      <div className="users-page-header">
        <div>
          <h1>User Management</h1>
          <p>
            Manage users, support agents, and system roles.
          </p>
        </div>

        <div className="users-count-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
      </div>

      {error && (
        <div className="users-error">
          {error}
        </div>
      )}

      <div className="users-toolbar">

        <div className="users-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          className="users-role-filter"
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
          }
        >
          <option value="ALL">All Roles</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="SUPPORT_AGENT">
            Support Agent
          </option>
          <option value="ADMIN">Admin</option>
        </select>

      </div>

      <div className="users-table-card">

        {loading ? (
          <div className="users-state">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-state">
            No users found.
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Change Role</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <div className="users-user-cell">
                        <div className="users-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>
                            User #{user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`users-role-badge ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {user.role === "SUPPORT_AGENT"
                          ? "Support Agent"
                          : user.role}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <select
                        className="users-role-select"
                        value={user.role}
                        disabled={
                          updatingId === user.id
                        }
                        onChange={(event) =>
                          updateRole(
                            user.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="EMPLOYEE">
                          Employee
                        </option>

                        <option value="SUPPORT_AGENT">
                          Support Agent
                        </option>

                        <option value="ADMIN">
                          Admin
                        </option>
                      </select>
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

export default Users;