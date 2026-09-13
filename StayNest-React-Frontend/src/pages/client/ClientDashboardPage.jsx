import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Eye,
  Home,
  LogOut,
  Pencil,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getClientDashboardData,
} from "../../services/clientDashboardService";

import {
  getLoggedInUser,
  removeAuthenticatedAccount,
} from "../../utils/authStorage";

import {
  getApiErrorMessage,
} from "../../utils/apiError";

import "../../styles/clientDashboardPage.css";
import "../../styles/pageApiState.css";

function ClientDashboardPage() {
  const navigate = useNavigate();

  const loggedInClient =
    getLoggedInUser();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getClientDashboardData();

      setDashboardData(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the Client dashboard."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    removeAuthenticatedAccount();

    window.dispatchEvent(
      new CustomEvent(
        "staynest:auth-changed"
      )
    );

    navigate("/client/login", {
      replace: true,
    });
  };

  return (
    <main className="client-dashboard-page">
      <aside className="client-dashboard-sidebar">
        <Link
          to="/client/dashboard"
          className="client-dashboard-logo"
        >
          <span>Stay</span>Nest
        </Link>

        <nav className="client-dashboard-navigation">
          <Link
            to="/client/dashboard"
            className="active"
          >
            <Home size={19} />
            Dashboard
          </Link>

          <Link to="/client">
            <Pencil size={19} />
            Website editor
          </Link>

          <Link to="/client/properties">
            <Home size={19} />
            Properties
          </Link>

          <Link to="/client/bookings">
            <Calendar size={19} />
            Bookings
          </Link>

          <Link to="/client/profile">
            <User size={19} />
            Business profile
          </Link>

          <Link to="/">
            <Eye size={19} />
            View website
          </Link>
        </nav>

        <button
          type="button"
          className="client-dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <section className="client-dashboard-content">
        <header className="client-dashboard-header">
          <div>
            <p>CLIENT PORTAL</p>

            <h1>
              Welcome,{" "}
              {loggedInClient?.fullName ||
                "Website Owner"}
            </h1>

            <span>
              Manage your website, properties and
              customer bookings.
            </span>
          </div>

          <Link
            to="/client"
            className="open-editor-button"
          >
            <Pencil size={18} />
            Open website editor
          </Link>
        </header>

        {loading && (
          <div className="client-dashboard-state">
            <div className="page-api-loader" />
            <h2>Loading dashboard</h2>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="client-dashboard-state">
            <RefreshCw size={38} />

            <h2>Unable to load dashboard</h2>

            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={loadDashboard}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && dashboardData && (
          <>
            <section className="client-statistics-grid">
              <StatisticCard
                icon={Home}
                label="Total properties"
                value={
                  dashboardData.statistics
                    .totalProperties
                }
                description="All properties in your website"
              />

              <StatisticCard
                icon={CheckCircle}
                label="Active properties"
                value={
                  dashboardData.statistics
                    .activeProperties
                }
                description="Properties visible to users"
              />

              <StatisticCard
                icon={Calendar}
                label="Total bookings"
                value={
                  dashboardData.statistics
                    .totalBookings
                }
                description="All customer booking requests"
              />

              <StatisticCard
                icon={Calendar}
                label="Pending requests"
                value={
                  dashboardData.statistics
                    .pendingBookings
                }
                description="Bookings awaiting confirmation"
              />

              <StatisticCard
                icon={CheckCircle}
                label="Confirmed bookings"
                value={
                  dashboardData.statistics
                    .confirmedBookings
                }
                description="Bookings confirmed for guests"
              />

              <StatisticCard
                icon={Users}
                label="Confirmed guests"
                value={
                  dashboardData.statistics
                    .totalGuests
                }
                description="Guests in confirmed bookings"
              />
            </section>

            <section className="client-dashboard-panels">
              <div className="client-panel-heading">
                <div>
                  <p>RECENT ACTIVITY</p>
                  <h2>Recent bookings</h2>
                </div>

                <Link to="/client/bookings">
                  View all
                </Link>
              </div>

              {dashboardData.recentBookings
                .length > 0 ? (
                <div className="client-booking-list">
                  {dashboardData.recentBookings.map(
                    (booking) => (
                      <BookingRow
                        key={booking.id}
                        booking={booking}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="client-dashboard-empty">
                  <Calendar size={35} />

                  <h3>No bookings yet</h3>

                  <p>
                    New booking requests will appear
                    here.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function StatisticCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <article className="client-statistic-card">
      <div>
        <Icon size={23} />
      </div>

      <span>{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function BookingRow({ booking }) {
  const guestName =
    booking.guestName || "Guest";

  const initials = guestName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="client-booking-row">
      <div className="client-booking-avatar">
        {initials}
      </div>

      <div className="client-booking-details">
        <strong>{guestName}</strong>

        <span>
          {booking.homestayName}
        </span>
      </div>

      <span className="client-booking-dates">
        {booking.checkIn} –{" "}
        {booking.checkOut}
      </span>

      <span
        className={`client-booking-status ${booking.status.toLowerCase()}`}
      >
        {booking.status}
      </span>
    </div>
  );
}

export default ClientDashboardPage;