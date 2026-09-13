import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Calendar,
  Check,
  Eye,
  Home,
  LogOut,
  Pencil,
  RefreshCw,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getClientDashboardData,
  updateClientBookingStatus,
} from "../../services/clientDashboardService";

import {
  removeAuthenticatedAccount,
} from "../../utils/authStorage";

import {
  getApiErrorMessage,
} from "../../utils/apiError";

import "../../styles/clientDashboardPage.css";
import "../../styles/clientBookingsPage.css";
import "../../styles/pageApiState.css";

const statuses = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

function ClientBookingsPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState([]);

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [searchText, setSearchText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [statusTarget, setStatusTarget] =
    useState(null);

  const [updating, setUpdating] =
    useState(false);

  const loadBookings = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getClientDashboardData();

      setBookings(response.bookings);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load bookings."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const searchValue = searchText
      .trim()
      .toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        selectedStatus === "ALL" ||
        booking.status === selectedStatus;

      const matchesSearch =
        !searchValue ||
        booking.guestName
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.guestEmail
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.homestayName
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.bookingNumber
          ?.toLowerCase()
          .includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [
    bookings,
    selectedStatus,
    searchText,
  ]);

  const requestStatusChange = (
    booking,
    status
  ) => {
    setErrorMessage("");

    setStatusTarget({
      booking,
      status,
    });
  };

  const handleStatusChange = async () => {
    if (!statusTarget) {
      return;
    }

    setUpdating(true);
    setErrorMessage("");

    try {
      const updatedBooking =
        await updateClientBookingStatus(
          statusTarget.booking.id,
          statusTarget.status
        );

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking
        )
      );

      if (
        selectedBooking?.id ===
        updatedBooking.id
      ) {
        setSelectedBooking(updatedBooking);
      }

      setStatusTarget(null);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to update booking status."
        )
      );
    } finally {
      setUpdating(false);
    }
  };

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
          <Link to="/client/dashboard">
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

          <Link
            to="/client/bookings"
            className="active"
          >
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
            <p>BOOKING MANAGEMENT</p>
            <h1>Customer bookings</h1>

            <span>
              Review and manage customer booking
              requests.
            </span>
          </div>
        </header>

        <section className="client-bookings-controls">
          <div className="client-booking-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search guest, property or booking number"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />
          </div>

          <div className="client-booking-tabs">
            {statuses.map((status) => (
              <button
                type="button"
                key={status}
                className={
                  selectedStatus === status
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedStatus(status)
                }
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="client-bookings-state">
            <div className="page-api-loader" />
            <h2>Loading bookings</h2>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="client-bookings-error">
            <RefreshCw size={18} />
            {errorMessage}

            <button
              type="button"
              onClick={loadBookings}
            >
              Retry
            </button>
          </div>
        )}

        {!loading &&
          filteredBookings.length > 0 && (
            <section className="client-bookings-table-wrapper">
              <table className="client-bookings-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Stay dates</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map(
                    (booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>
                            {
                              booking.bookingNumber
                            }
                          </strong>

                          <small>
                            {formatDate(
                              booking.createdAt
                            )}
                          </small>
                        </td>

                        <td>
                          <strong>
                            {booking.guestName}
                          </strong>

                          <small>
                            {booking.guestEmail}
                          </small>
                        </td>

                        <td>
                          <strong>
                            {booking.homestayName}
                          </strong>

                          <small>
                            {
                              booking.homestayLocation
                            }
                          </small>
                        </td>

                        <td>
                          <span>
                            {booking.checkIn}
                          </span>

                          <small>
                            to {booking.checkOut}
                          </small>
                        </td>

                        <td>
                          <span className="booking-guests">
                            <Users size={15} />
                            {booking.guests}
                          </span>
                        </td>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              booking.totalAmount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`client-table-status ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td>
                          <div className="client-booking-actions">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBooking(
                                  booking
                                )
                              }
                              title="View booking"
                            >
                              <Eye size={16} />
                            </button>

                            {booking.status ===
                              "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  className="approve"
                                  onClick={() =>
                                    requestStatusChange(
                                      booking,
                                      "CONFIRMED"
                                    )
                                  }
                                  title="Confirm booking"
                                >
                                  <Check
                                    size={16}
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="reject"
                                  onClick={() =>
                                    requestStatusChange(
                                      booking,
                                      "REJECTED"
                                    )
                                  }
                                  title="Reject booking"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}

                            {booking.status ===
                              "CONFIRMED" && (
                              <button
                                type="button"
                                className="approve"
                                onClick={() =>
                                  requestStatusChange(
                                    booking,
                                    "COMPLETED"
                                  )
                                }
                                title="Mark completed"
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </section>
          )}

        {!loading &&
          !errorMessage &&
          filteredBookings.length === 0 && (
            <div className="client-bookings-state">
              <Calendar size={40} />

              <h2>No bookings found</h2>

              <p>
                No booking matches the selected
                filters.
              </p>
            </div>
          )}
      </section>

      {selectedBooking && (
        <div
          className="client-booking-modal-overlay"
          onClick={() =>
            setSelectedBooking(null)
          }
        >
          <section
            className="client-booking-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <header>
              <div>
                <p>BOOKING DETAILS</p>

                <h2>
                  {selectedBooking.bookingNumber}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                <X size={21} />
              </button>
            </header>

            <div className="client-booking-modal-body">
              <BookingDetail
                label="Guest"
                value={
                  selectedBooking.guestName
                }
              />

              <BookingDetail
                label="Email"
                value={
                  selectedBooking.guestEmail
                }
              />

              <BookingDetail
                label="Phone"
                value={
                  selectedBooking.guestPhone
                }
              />

              <BookingDetail
                label="Property"
                value={
                  selectedBooking.homestayName
                }
              />

              <BookingDetail
                label="Check in"
                value={
                  selectedBooking.checkIn
                }
              />

              <BookingDetail
                label="Check out"
                value={
                  selectedBooking.checkOut
                }
              />

              <BookingDetail
                label="Guests"
                value={
                  selectedBooking.guests
                }
              />

              <BookingDetail
                label="Nights"
                value={
                  selectedBooking.nights
                }
              />

              <BookingDetail
                label="Total amount"
                value={`₹${Number(
                  selectedBooking.totalAmount
                ).toLocaleString("en-IN")}`}
              />

              <BookingDetail
                label="Status"
                value={
                  selectedBooking.status
                }
              />

              <div className="booking-detail-request">
                <span>Special request</span>

                <p>
                  {selectedBooking.specialRequest ||
                    "No special request"}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {statusTarget && (
        <div className="client-booking-modal-overlay">
          <div className="client-status-confirmation">
            <h2>
              Change booking status?
            </h2>

            <p>
              Change booking{" "}
              <strong>
                {
                  statusTarget.booking
                    .bookingNumber
                }
              </strong>{" "}
              to{" "}
              <strong>
                {statusTarget.status}
              </strong>
              ?
            </p>

            {errorMessage && (
              <div className="client-bookings-error">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() =>
                  setStatusTarget(null)
                }
                disabled={updating}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-status"
                onClick={handleStatusChange}
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BookingDetail({
  label,
  value,
}) {
  return (
    <div className="booking-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatStatus(status) {
  return (
    status.charAt(0) +
    status.slice(1).toLowerCase()
  );
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "en-IN"
  );
}

export default ClientBookingsPage;