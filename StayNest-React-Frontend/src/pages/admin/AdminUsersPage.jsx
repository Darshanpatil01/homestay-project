import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Eye,
  Home,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  getAdminUsers,
  updateAdminUserStatus,
} from "../../services/adminService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/adminUsersPage.css";

function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [statusConfirmation, setStatusConfirmation] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAdminUsers();

      const userList = Array.isArray(response)
        ? response
        : response.content ||
          response.users ||
          response.data ||
          [];

      setUsers(userList);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load registered users."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchText
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        (user.fullName || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (user.email || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (user.phone || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === "ALL" ||
        user.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchText, selectedStatus]);

  const requestStatusChange = (
    user,
    newStatus
  ) => {
    setStatusConfirmation({
      user,
      newStatus,
    });
  };

  const confirmStatusChange = async () => {
    if (!statusConfirmation) {
      return;
    }

    const { user, newStatus } =
      statusConfirmation;

    try {
      setUpdatingUserId(user.id);
      setErrorMessage("");

      const updatedUser =
        await updateAdminUserStatus(
          user.id,
          newStatus
        );

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                ...updatedUser,
                status:
                  updatedUser?.status ||
                  newStatus,
              }
            : currentUser
        )
      );

      setStatusConfirmation(null);

      setSuccessMessage(
        `${user.fullName}'s account is now ${formatStatus(
          newStatus
        )}.`
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to update the user status."
        )
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "staynest-authenticated-account"
    );

    localStorage.removeItem(
      "staynest-access-token"
    );

    localStorage.removeItem(
      "staynest-refresh-token"
    );

    navigate("/admin", {
      replace: true,
    });
  };

  return (
    <main className="admin-users-page">
      <AdminUsersSidebar
        onLogout={handleLogout}
      />

      <section className="admin-users-content">
        <header className="admin-users-header">
          <div>
            <p>USER MANAGEMENT</p>
            <h1>Registered users</h1>

            <span>
              View user accounts and manage their
              access status.
            </span>
          </div>

          <button
            type="button"
            className="admin-users-refresh"
            onClick={loadUsers}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "admin-users-spinning"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        {successMessage && (
          <div className="admin-users-message success">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="admin-users-message error">
            <AlertCircle size={20} />

            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={loadUsers}
            >
              Try again
            </button>
          </div>
        )}

        <section className="admin-users-summary">
          <UserSummaryCard
            title="Total users"
            value={users.length}
            color="total"
          />

          <UserSummaryCard
            title="Active"
            value={countUsersByStatus(
              users,
              "ACTIVE"
            )}
            color="active"
          />

          <UserSummaryCard
            title="Inactive"
            value={countUsersByStatus(
              users,
              "INACTIVE"
            )}
            color="inactive"
          />

          <UserSummaryCard
            title="Blocked"
            value={countUsersByStatus(
              users,
              "BLOCKED"
            )}
            color="blocked"
          />
        </section>

        <section className="admin-users-panel">
          <div className="admin-users-toolbar">
            <div className="admin-users-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search name, email or phone"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              aria-label="Filter users by status"
            >
              <option value="ALL">
                All statuses
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="BLOCKED">
                Blocked
              </option>
            </select>
          </div>

          {loading ? (
            <div className="admin-users-loading">
              <LoaderCircle size={40} />
              <p>Loading registered users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-identity">
                          <div className="admin-user-avatar">
                            {getInitials(
                              user.fullName
                            )}
                          </div>

                          <div>
                            <strong>
                              {user.fullName ||
                                "Unnamed user"}
                            </strong>

                            <span>
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {user.phone || "Not provided"}
                      </td>

                      <td>
                        <span className="admin-user-role">
                          {user.role || "USER"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-user-status ${(
                            user.status ||
                            "ACTIVE"
                          ).toLowerCase()}`}
                        >
                          {formatStatus(
                            user.status ||
                              "ACTIVE"
                          )}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      <td>
                        <div className="admin-user-actions">
                          <button
                            type="button"
                            className="view"
                            onClick={() =>
                              setSelectedUser(
                                user
                              )
                            }
                            aria-label={`View ${user.fullName}`}
                            title="View user"
                          >
                            <Eye size={17} />
                          </button>

                          {user.status !==
                            "ACTIVE" && (
                            <button
                              type="button"
                              className="activate"
                              onClick={() =>
                                requestStatusChange(
                                  user,
                                  "ACTIVE"
                                )
                              }
                              disabled={
                                updatingUserId ===
                                user.id
                              }
                              aria-label={`Activate ${user.fullName}`}
                              title="Activate user"
                            >
                              <CheckCircle
                                size={17}
                              />
                            </button>
                          )}

                          {user.status !==
                            "INACTIVE" && (
                            <button
                              type="button"
                              className="deactivate"
                              onClick={() =>
                                requestStatusChange(
                                  user,
                                  "INACTIVE"
                                )
                              }
                              disabled={
                                updatingUserId ===
                                user.id
                              }
                              aria-label={`Deactivate ${user.fullName}`}
                              title="Deactivate user"
                            >
                              <UserCog size={17} />
                            </button>
                          )}

                          {user.status !==
                            "BLOCKED" && (
                            <button
                              type="button"
                              className="block"
                              onClick={() =>
                                requestStatusChange(
                                  user,
                                  "BLOCKED"
                                )
                              }
                              disabled={
                                updatingUserId ===
                                user.id
                              }
                              aria-label={`Block ${user.fullName}`}
                              title="Block user"
                            >
                              <Lock size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-users-empty">
              <Users size={45} />

              <h2>No users found</h2>

              <p>
                Try changing your search or status
                filter.
              </p>
            </div>
          )}
        </section>
      </section>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
        />
      )}

      {statusConfirmation && (
        <StatusConfirmationModal
          confirmation={
            statusConfirmation
          }
          loading={
            updatingUserId ===
            statusConfirmation.user.id
          }
          onCancel={() =>
            setStatusConfirmation(null)
          }
          onConfirm={
            confirmStatusChange
          }
        />
      )}
    </main>
  );
}

function UserSummaryCard({
  title,
  value,
  color,
}) {
  return (
    <article
      className={`admin-user-summary-card ${color}`}
    >
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function UserDetailsModal({
  user,
  onClose,
}) {
  return (
    <div
      className="admin-user-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-user-details-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="admin-user-modal-close"
          onClick={onClose}
          aria-label="Close user details"
        >
          <X size={21} />
        </button>

        <div className="admin-user-details-heading">
          <div className="admin-user-large-avatar">
            {getInitials(user.fullName)}
          </div>

          <div>
            <p>USER DETAILS</p>
            <h2>
              {user.fullName || "Unnamed user"}
            </h2>

            <span
              className={`admin-user-status ${(
                user.status ||
                "ACTIVE"
              ).toLowerCase()}`}
            >
              {formatStatus(
                user.status || "ACTIVE"
              )}
            </span>
          </div>
        </div>

        <div className="admin-user-details-grid">
          <UserDetail
            label="Email address"
            value={user.email}
          />

          <UserDetail
            label="Phone number"
            value={user.phone}
          />

          <UserDetail
            label="Role"
            value={user.role || "USER"}
          />

          <UserDetail
            label="City"
            value={user.city}
          />

          <UserDetail
            label="State"
            value={user.state}
          />

          <UserDetail
            label="Registration date"
            value={formatDate(
              user.createdAt
            )}
          />
        </div>
      </div>
    </div>
  );
}

function UserDetail({ label, value }) {
  return (
    <div className="admin-user-detail">
      <small>{label}</small>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

function StatusConfirmationModal({
  confirmation,
  loading,
  onCancel,
  onConfirm,
}) {
  const { user, newStatus } =
    confirmation;

  const actionText =
    newStatus === "ACTIVE"
      ? "activate"
      : newStatus === "BLOCKED"
        ? "block"
        : "deactivate";

  return (
    <div
      className="admin-user-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="admin-status-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className={`admin-status-modal-icon ${newStatus.toLowerCase()}`}
        >
          {newStatus === "ACTIVE" ? (
            <CheckCircle size={28} />
          ) : (
            <AlertCircle size={28} />
          )}
        </div>

        <h2>
          {formatStatus(newStatus)} this
          user?
        </h2>

        <p>
          Are you sure you want to {actionText}{" "}
          <strong>{user.fullName}</strong>?
        </p>

        {newStatus === "BLOCKED" && (
          <span>
            The user will not be allowed to
            access protected account features.
          </span>
        )}

        <div className="admin-status-modal-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`confirm ${newStatus.toLowerCase()}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <LoaderCircle
                className="admin-users-spinning"
                size={17}
              />
            )}

            {loading
              ? "Updating..."
              : `Yes, ${actionText}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUsersSidebar({
  onLogout,
}) {
  return (
    <aside className="admin-users-sidebar">
      <Link
        to="/admin/dashboard"
        className="admin-users-logo"
      >
        <span>Stay</span>Nest
        <small>ADMIN</small>
      </Link>

      <nav className="admin-users-navigation">
        <NavLink to="/admin/dashboard">
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users">
          <Users size={19} />
          Users
        </NavLink>

        <NavLink to="/admin/properties">
          <Home size={19} />
          Homestays
        </NavLink>

        <NavLink to="/admin/bookings">
          <CalendarDays size={19} />
          Bookings
        </NavLink>

        <NavLink to="/admin/profile">
          <UserCog size={19} />
          Admin profile
        </NavLink>

        <NavLink to="/">
          <Eye size={19} />
          View website
        </NavLink>
      </nav>

      <button
        type="button"
        className="admin-users-logout"
        onClick={onLogout}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

function getInitials(fullName = "") {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "U";
}

function formatStatus(status = "") {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function countUsersByStatus(
  users,
  status
) {
  return users.filter(
    (user) => user.status === status
  ).length;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default AdminUsersPage;