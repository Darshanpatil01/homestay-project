import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Clock,
  Eye,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  getAdminBookings,
  updateAdminBookingStatus,
} from "../../services/adminService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/adminBookingsPage.css";

const bookingStatuses = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

function AdminBookingsPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [statusConfirmation, setStatusConfirmation] =
    useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    loadBookings();
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

  const loadBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAdminBookings();

      const bookingList = Array.isArray(response)
        ? response
        : response.content ||
          response.bookings ||
          response.data ||
          [];

      setBookings(bookingList);
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

  const filteredBookings = useMemo(() => {
    const searchValue = searchText
      .trim()
      .toLowerCase();

    return bookings.filter((booking) => {
      const guestName = getGuestName(booking);
      const propertyName =
        getPropertyName(booking);

      const bookingNumber = String(
        booking.bookingNumber ||
          booking.id ||
          ""
      );

      const matchesSearch =
        !searchValue ||
        guestName
          .toLowerCase()
          .includes(searchValue) ||
        propertyName
          .toLowerCase()
          .includes(searchValue) ||
        bookingNumber
          .toLowerCase()
          .includes(searchValue) ||
        (booking.email || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        selectedStatus === "ALL" ||
        booking.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [
    bookings,
    searchText,
    selectedStatus,
  ]);

  const openStatusConfirmation = (
    booking,
    newStatus
  ) => {
    setStatusConfirmation({
      booking,
      newStatus,
    });
  };

  const confirmStatusUpdate = async () => {
    if (!statusConfirmation) {
      return;
    }

    const { booking, newStatus } =
      statusConfirmation;

    try {
      setUpdatingBookingId(booking.id);
      setErrorMessage("");

      const updatedBooking =
        await updateAdminBookingStatus(
          booking.id,
          newStatus
        );

      setBookings((previousBookings) =>
        previousBookings.map(
          (currentBooking) =>
            currentBooking.id === booking.id
              ? {
                  ...currentBooking,
                  ...updatedBooking,
                  status:
                    updatedBooking?.status ||
                    newStatus,
                }
              : currentBooking
        )
      );

      setSelectedBooking(
        (currentSelectedBooking) =>
          currentSelectedBooking?.id ===
          booking.id
            ? {
                ...currentSelectedBooking,
                ...updatedBooking,
                status:
                  updatedBooking?.status ||
                  newStatus,
              }
            : currentSelectedBooking
      );

      setStatusConfirmation(null);

      setSuccessMessage(
        `Booking #${getBookingNumber(
          booking
        )} updated to ${formatStatus(
          newStatus
        )}.`
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to update booking status."
        )
      );
    } finally {
      setUpdatingBookingId(null);
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
    <main className="admin-bookings-page">
      <AdminBookingsSidebar
        onLogout={handleLogout}
      />

      <section className="admin-bookings-content">
        <header className="admin-bookings-header">
          <div>
            <p>BOOKING MANAGEMENT</p>
            <h1>Customer bookings</h1>

            <span>
              Review booking information and update
              reservation statuses.
            </span>
          </div>

          <button
            type="button"
            className="admin-bookings-refresh"
            onClick={loadBookings}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "admin-bookings-spinning"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        {successMessage && (
          <div className="admin-bookings-message success">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="admin-bookings-message error">
            <AlertCircle size={20} />

            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={loadBookings}
            >
              Try again
            </button>
          </div>
        )}

        <section className="admin-bookings-summary">
          <BookingSummary
            title="Total bookings"
            value={bookings.length}
            color="total"
          />

          <BookingSummary
            title="Pending"
            value={countBookings(
              bookings,
              "PENDING"
            )}
            color="pending"
          />

          <BookingSummary
            title="Confirmed"
            value={countBookings(
              bookings,
              "CONFIRMED"
            )}
            color="confirmed"
          />

          <BookingSummary
            title="Completed"
            value={countBookings(
              bookings,
              "COMPLETED"
            )}
            color="completed"
          />
        </section>

        <section className="admin-bookings-panel">
          <div className="admin-bookings-toolbar">
            <div className="admin-bookings-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search booking, guest or property"
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
              aria-label="Filter bookings by status"
            >
              <option value="ALL">
                All statuses
              </option>

              {bookingStatuses.map((status) => (
                <option
                  value={status}
                  key={status}
                >
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="admin-bookings-loading">
              <LoaderCircle size={42} />
              <p>Loading bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="admin-bookings-table-wrapper">
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Stay dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map(
                    (booking) => (
                      <BookingTableRow
                        key={booking.id}
                        booking={booking}
                        updating={
                          updatingBookingId ===
                          booking.id
                        }
                        onView={() =>
                          setSelectedBooking(
                            booking
                          )
                        }
                        onStatusChange={(
                          newStatus
                        ) =>
                          openStatusConfirmation(
                            booking,
                            newStatus
                          )
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-bookings-empty">
              <CalendarDays size={46} />

              <h2>No bookings found</h2>

              <p>
                Try changing the search or status
                filter.
              </p>
            </div>
          )}
        </section>
      </section>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          updating={
            updatingBookingId ===
            selectedBooking.id
          }
          onClose={() =>
            setSelectedBooking(null)
          }
          onStatusChange={(newStatus) =>
            openStatusConfirmation(
              selectedBooking,
              newStatus
            )
          }
        />
      )}

      {statusConfirmation && (
        <BookingStatusModal
          confirmation={
            statusConfirmation
          }
          loading={
            updatingBookingId ===
            statusConfirmation.booking.id
          }
          onCancel={() =>
            setStatusConfirmation(null)
          }
          onConfirm={
            confirmStatusUpdate
          }
        />
      )}
    </main>
  );
}

function BookingTableRow({
  booking,
  updating,
  onView,
  onStatusChange,
}) {
  const status =
    booking.status || "PENDING";

  return (
    <tr>
      <td>
        <strong className="admin-booking-reference">
          #{getBookingNumber(booking)}
        </strong>

        <small>
          {formatDate(
            booking.createdAt ||
              booking.bookingDate
          )}
        </small>
      </td>

      <td>
        <div className="admin-booking-guest">
          <div>
            {getInitials(
              getGuestName(booking)
            )}
          </div>

          <span>
            <strong>
              {getGuestName(booking)}
            </strong>

            <small>
              {booking.email ||
                booking.userEmail ||
                "Email unavailable"}
            </small>
          </span>
        </div>
      </td>

      <td>
        <strong className="admin-booking-property">
          {getPropertyName(booking)}
        </strong>

        <small className="admin-booking-location">
          <MapPin size={13} />

          {booking.location ||
            booking.homestayLocation ||
            "Location unavailable"}
        </small>
      </td>

      <td>
        <span className="admin-booking-dates">
          <CalendarDays size={16} />

          <span>
            {formatDate(booking.checkIn)}
            <small>to</small>
            {formatDate(booking.checkOut)}
          </span>
        </span>
      </td>

      <td>
        <strong className="admin-booking-amount">
          ₹
          {Number(
            booking.totalAmount ||
              booking.totalPrice ||
              0
          ).toLocaleString("en-IN")}
        </strong>
      </td>

      <td>
        <span
          className={`admin-booking-status ${status.toLowerCase()}`}
        >
          {formatStatus(status)}
        </span>
      </td>

      <td>
        <div className="admin-booking-actions">
          <button
            type="button"
            className="view"
            onClick={onView}
            aria-label="View booking"
            title="View booking"
          >
            <Eye size={17} />
          </button>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value
              )
            }
            disabled={updating}
            aria-label="Update booking status"
          >
            {bookingStatuses.map(
              (bookingStatus) => (
                <option
                  value={bookingStatus}
                  key={bookingStatus}
                >
                  {formatStatus(
                    bookingStatus
                  )}
                </option>
              )
            )}
          </select>
        </div>
      </td>
    </tr>
  );
}

function BookingDetailsModal({
  booking,
  updating,
  onClose,
  onStatusChange,
}) {
  const status =
    booking.status || "PENDING";

  return (
    <div
      className="admin-booking-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-booking-details-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="admin-booking-modal-close"
          onClick={onClose}
          aria-label="Close booking details"
        >
          <X size={21} />
        </button>

        <div className="admin-booking-modal-heading">
          <p>BOOKING DETAILS</p>

          <h2>
            Booking #{getBookingNumber(booking)}
          </h2>

          <span
            className={`admin-booking-status ${status.toLowerCase()}`}
          >
            {formatStatus(status)}
          </span>
        </div>

        <div className="admin-booking-modal-section">
          <h3>Guest information</h3>

          <div className="admin-booking-details-grid">
            <BookingDetail
              label="Guest name"
              value={getGuestName(booking)}
            />

            <BookingDetail
              label="Email address"
              value={
                booking.email ||
                booking.userEmail
              }
            />

            <BookingDetail
              label="Phone number"
              value={
                booking.phone ||
                booking.userPhone
              }
            />

            <BookingDetail
              label="Number of guests"
              value={
                booking.guests ||
                booking.guestCount
              }
            />
          </div>
        </div>

        <div className="admin-booking-modal-section">
          <h3>Stay information</h3>

          <div className="admin-booking-details-grid">
            <BookingDetail
              label="Property"
              value={getPropertyName(booking)}
            />

            <BookingDetail
              label="Location"
              value={
                booking.location ||
                booking.homestayLocation
              }
            />

            <BookingDetail
              label="Check in"
              value={formatDate(
                booking.checkIn
              )}
            />

            <BookingDetail
              label="Check out"
              value={formatDate(
                booking.checkOut
              )}
            />
          </div>
        </div>

        <div className="admin-booking-modal-section">
          <h3>Payment summary</h3>

          <div className="admin-booking-payment-summary">
            <span>Total booking amount</span>

            <strong>
              ₹
              {Number(
                booking.totalAmount ||
                  booking.totalPrice ||
                  0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {booking.specialRequest && (
          <div className="admin-booking-modal-section">
            <h3>Special request</h3>

            <p className="admin-special-request">
              {booking.specialRequest}
            </p>
          </div>
        )}

        <div className="admin-booking-modal-status">
          <label htmlFor="adminModalBookingStatus">
            Update booking status
          </label>

          <select
            id="adminModalBookingStatus"
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value
              )
            }
            disabled={updating}
          >
            {bookingStatuses.map(
              (bookingStatus) => (
                <option
                  value={bookingStatus}
                  key={bookingStatus}
                >
                  {formatStatus(
                    bookingStatus
                  )}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

function BookingStatusModal({
  confirmation,
  loading,
  onCancel,
  onConfirm,
}) {
  const { booking, newStatus } =
    confirmation;

  const StatusIcon =
    newStatus === "CONFIRMED"
      ? CheckCircle
      : newStatus === "COMPLETED"
        ? CheckCircle
        : newStatus === "CANCELLED"
          ? XCircle
          : Clock;

  return (
    <div
      className="admin-booking-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="admin-booking-status-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className={`admin-booking-status-icon ${newStatus.toLowerCase()}`}
        >
          <StatusIcon size={29} />
        </div>

        <h2>
          Change booking status?
        </h2>

        <p>
          Booking{" "}
          <strong>
            #{getBookingNumber(booking)}
          </strong>{" "}
          will be changed to{" "}
          <strong>
            {formatStatus(newStatus)}
          </strong>
          .
        </p>

        <div className="admin-booking-status-actions">
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
                className="admin-bookings-spinning"
                size={17}
              />
            )}

            {loading
              ? "Updating..."
              : "Confirm update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingDetail({
  label,
  value,
}) {
  return (
    <div className="admin-booking-detail">
      <small>{label}</small>
      <strong>
        {value || "Not provided"}
      </strong>
    </div>
  );
}

function BookingSummary({
  title,
  value,
  color,
}) {
  return (
    <article
      className={`admin-booking-summary-card ${color}`}
    >
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function AdminBookingsSidebar({
  onLogout,
}) {
  return (
    <aside className="admin-bookings-sidebar">
      <Link
        to="/admin/dashboard"
        className="admin-bookings-logo"
      >
        <span>Stay</span>Nest
        <small>ADMIN</small>
      </Link>

      <nav className="admin-bookings-navigation">
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
        className="admin-bookings-logout"
        onClick={onLogout}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

function getGuestName(booking) {
  return (
    booking.guestName ||
    booking.userName ||
    booking.customerName ||
    booking.fullName ||
    booking.user?.fullName ||
    "Guest"
  );
}

function getPropertyName(booking) {
  return (
    booking.homestayName ||
    booking.propertyName ||
    booking.homestay?.name ||
    "Homestay"
  );
}

function getBookingNumber(booking) {
  return (
    booking.bookingNumber ||
    booking.id ||
    "N/A"
  );
}

function getInitials(name = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "G";
}

function countBookings(
  bookings,
  status
) {
  return bookings.filter(
    (booking) => booking.status === status
  ).length;
}

function formatStatus(status = "") {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default AdminBookingsPage;