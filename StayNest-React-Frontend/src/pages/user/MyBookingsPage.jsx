import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import {
  cancelBooking,
  getMyBookings,
} from "../../services/bookingService";

import {
  getLoggedInUser,
  isAuthenticated,
} from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/myBookingsPage.css";
import "../../styles/pageApiState.css";
import "../../styles/authApiFeedback.css";

const bookingStatuses = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

function MyBookingsPage() {
  const [bookings, setBookings] =
    useState([]);

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  const loggedInUser = getLoggedInUser();

  const loadBookings = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getMyBookings();
      setBookings(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load your bookings."
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
    return bookings.filter(
      (booking) =>
        selectedStatus === "ALL" ||
        booking.status === selectedStatus
    );
  }, [bookings, selectedStatus]);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(bookingId);
    setErrorMessage("");

    try {
      const updatedBooking =
        await cancelBooking(bookingId);

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === bookingId
            ? updatedBooking
            : booking
        )
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to cancel the booking."
        )
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated()) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <CalendarDays size={45} />

          <h1>Sign in to view bookings</h1>

          <p>
            Use the Sign In button on the homepage
            before opening your bookings.
          </p>

          <Link to="/">Return to homepage</Link>
        </main>

        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading your bookings</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="my-bookings-page">
        <section className="my-bookings-header">
          <div>
            <p className="section-small-title">
              YOUR JOURNEYS
            </p>

            <h1>My bookings</h1>

            <span>
              Welcome, {loggedInUser?.fullName}.
              View and manage your stays.
            </span>
          </div>
        </section>

        <section className="my-bookings-content">
          {errorMessage && (
            <div
              className="auth-api-error"
              role="alert"
            >
              {errorMessage}

              <button
                type="button"
                onClick={loadBookings}
              >
                Retry
              </button>
            </div>
          )}

          <div className="booking-status-tabs">
            {bookingStatuses.map((status) => (
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
                {status.charAt(0) +
                  status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {filteredBookings.length > 0 ? (
            <div className="user-bookings-list">
              {filteredBookings.map(
                (booking) => (
                  <article
                    className="user-booking-card"
                    key={booking.id}
                  >
                    <img
                      src={booking.homestayImage}
                      alt={booking.homestayName}
                    />

                    <div className="user-booking-information">
                      <div className="booking-card-heading">
                        <div>
                          <span className="booking-number">
                            Booking #
                            {booking.bookingNumber}
                          </span>

                          <h2>
                            {booking.homestayName}
                          </h2>

                          <p>
                            <MapPin size={15} />
                            {
                              booking.homestayLocation
                            }
                          </p>
                        </div>

                        <span
                          className={`booking-status ${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="booking-stay-details">
                        <div>
                          <CalendarDays size={20} />

                          <span>
                            <small>Check in</small>
                            <strong>
                              {booking.checkIn}
                            </strong>
                          </span>
                        </div>

                        <div>
                          <CalendarDays size={20} />

                          <span>
                            <small>Check out</small>
                            <strong>
                              {booking.checkOut}
                            </strong>
                          </span>
                        </div>

                        <div>
                          <Users size={20} />

                          <span>
                            <small>Guests</small>
                            <strong>
                              {booking.guests}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="user-booking-footer">
                        <p>
                          Total amount

                          <strong>
                            ₹
                            {Number(
                              booking.totalAmount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </p>

                        <div>
                          {[
                            "PENDING",
                            "CONFIRMED",
                          ].includes(
                            booking.status
                          ) && (
                            <button
                              type="button"
                              className="cancel-booking-button"
                              disabled={
                                cancellingId ===
                                booking.id
                              }
                              onClick={() =>
                                handleCancel(
                                  booking.id
                                )
                              }
                            >
                              {cancellingId ===
                              booking.id
                                ? "Cancelling..."
                                : "Cancel booking"}
                            </button>
                          )}

                          <Link
                            to={`/homestays/${booking.homestayId}`}
                          >
                            View property
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="bookings-empty-state">
              <Search size={42} />
              <h2>No bookings found</h2>

              <p>
                You don&apos;t have bookings with
                this status.
              </p>

              <Link to="/homestays">
                Explore homestays
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MyBookingsPage;