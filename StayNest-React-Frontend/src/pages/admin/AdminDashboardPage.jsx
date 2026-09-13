import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Eye,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  RefreshCw,
  UserCog,
  Users,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { getAdminDashboard } from "../../services/adminService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/adminDashboardPage.css";

const initialDashboardData = {
  totalUsers: 0,
  totalHomestays: 0,
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  recentBookings: [],
};

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(
    initialDashboardData
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAdminDashboard();

      setDashboardData({
        totalUsers:
          response.totalUsers ??
          response.userCount ??
          0,

        totalHomestays:
          response.totalHomestays ??
          response.homestayCount ??
          response.totalProperties ??
          0,

        totalBookings:
          response.totalBookings ??
          response.bookingCount ??
          0,

        pendingBookings:
          response.pendingBookings ??
          response.pendingBookingCount ??
          0,

        confirmedBookings:
          response.confirmedBookings ??
          response.confirmedBookingCount ??
          0,

        recentBookings:
          response.recentBookings ??
          response.bookings ??
          [],
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the admin dashboard."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "staynest-authenticated-account"
    );

    localStorage.removeItem("staynest-access-token");
    localStorage.removeItem("staynest-refresh-token");

    navigate("/admin", {
      replace: true,
    });
  };

  return (
    <main className="admin-dashboard-page">
      <AdminSidebar onLogout={handleLogout} />

      <section className="admin-dashboard-content">
        <header className="admin-dashboard-header">
          <div>
            <p>ADMINISTRATION</p>
            <h1>Dashboard overview</h1>

            <span>
              Monitor users, homestays and customer bookings.
            </span>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
            >
              <RefreshCw
                size={18}
                className={
                  loading ? "admin-spinning-icon" : ""
                }
              />

              Refresh
            </button>

            <Link to="/" target="_blank">
              <Eye size={18} />
              View website
            </Link>
          </div>
        </header>

        {errorMessage && (
          <div className="admin-dashboard-error">
            <AlertCircle size={20} />

            <span>{errorMessage}</span>

            <button type="button" onClick={loadDashboard}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="admin-dashboard-loading">
            <LoaderCircle size={42} />
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <section className="admin-statistics-grid">
              <StatisticCard
                icon={Users}
                title="Total users"
                value={dashboardData.totalUsers}
                description="Registered traveller accounts"
                color="green"
              />

              <StatisticCard
                icon={Home}
                title="Total homestays"
                value={dashboardData.totalHomestays}
                description="Properties available on the website"
                color="gold"
              />

              <StatisticCard
                icon={CalendarDays}
                title="Total bookings"
                value={dashboardData.totalBookings}
                description="All customer booking requests"
                color="blue"
              />

              <StatisticCard
                icon={AlertCircle}
                title="Pending bookings"
                value={dashboardData.pendingBookings}
                description="Bookings awaiting confirmation"
                color="orange"
              />
            </section>

            <section className="admin-dashboard-panels">
              <article className="admin-dashboard-panel">
                <div className="admin-panel-heading">
                  <div>
                    <p>RECENT ACTIVITY</p>
                    <h2>Recent bookings</h2>
                  </div>

                  <Link to="/admin/bookings">
                    View all bookings
                  </Link>
                </div>

                {dashboardData.recentBookings.length > 0 ? (
                  <div className="admin-recent-bookings">
                    {dashboardData.recentBookings
                      .slice(0, 5)
                      .map((booking) => (
                        <RecentBookingRow
                          key={booking.id}
                          booking={booking}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="admin-empty-dashboard">
                    <CalendarDays size={38} />

                    <h3>No recent bookings</h3>

                    <p>
                      New customer bookings will appear here.
                    </p>
                  </div>
                )}
              </article>

              <article className="admin-dashboard-panel">
                <div className="admin-panel-heading">
                  <div>
                    <p>BOOKING STATUS</p>
                    <h2>Booking summary</h2>
                  </div>
                </div>

                <div className="admin-booking-summary">
                  <div>
                    <span className="admin-summary-icon confirmed">
                      <CheckCircle size={22} />
                    </span>

                    <span>
                      <small>Confirmed bookings</small>

                      <strong>
                        {dashboardData.confirmedBookings}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <span className="admin-summary-icon pending">
                      <AlertCircle size={22} />
                    </span>

                    <span>
                      <small>Pending bookings</small>

                      <strong>
                        {dashboardData.pendingBookings}
                      </strong>
                    </span>
                  </div>

                  <Link to="/admin/bookings">
                    Manage bookings
                  </Link>
                </div>
              </article>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function StatisticCard({
  icon: Icon,
  title,
  value,
  description,
  color,
}) {
  return (
    <article className="admin-statistic-card">
      <div className={`admin-statistic-icon ${color}`}>
        <Icon size={24} />
      </div>

      <span>{title}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function RecentBookingRow({ booking }) {
  const guestName =
    booking.guestName ||
    booking.userName ||
    booking.customerName ||
    booking.fullName ||
    "Guest";

  const propertyName =
    booking.homestayName ||
    booking.propertyName ||
    "Homestay";

  const status = booking.status || "PENDING";

  const bookingNumber =
    booking.bookingNumber || booking.id;

  return (
    <div className="admin-recent-booking-row">
      <div className="admin-booking-avatar">
        {guestName
          .split(" ")
          .map((name) => name.charAt(0))
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>

      <div className="admin-recent-booking-details">
        <strong>{guestName}</strong>

        <span>{propertyName}</span>
      </div>

      <span className="admin-booking-number">
        #{bookingNumber}
      </span>

      <span
        className={`admin-dashboard-status ${status.toLowerCase()}`}
      >
        {status}
      </span>
    </div>
  );
}

function AdminSidebar({ onLogout }) {
  return (
    <aside className="admin-dashboard-sidebar">
      <Link
        to="/admin/dashboard"
        className="admin-dashboard-logo"
      >
        <span>Stay</span>Nest
        <small>ADMIN</small>
      </Link>

      <nav className="admin-dashboard-navigation">
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
        className="admin-dashboard-logout"
        onClick={onLogout}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

export default AdminDashboardPage;