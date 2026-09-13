import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { getHomestayById } from "../../services/homestayService";
import { createBooking } from "../../services/bookingService";

import {
  getLoggedInUser,
  isAuthenticated,
} from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/bookingPage.css";
import "../../styles/pageApiState.css";
import "../../styles/authApiFeedback.css";

function BookingPage() {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const loggedInUser = getLoggedInUser();
  const userLoggedIn = isAuthenticated();

  const [homestay, setHomestay] =
    useState(null);

  const [loadingProperty, setLoadingProperty] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [bookingComplete, setBookingComplete] =
    useState(false);

  const [completedBooking, setCompletedBooking] =
    useState(null);

  const [bookingData, setBookingData] =
    useState({
      checkIn: searchParams.get("checkIn") || "",
      checkOut:
        searchParams.get("checkOut") || "",
      guests:
        Number(searchParams.get("guests")) || 1,
      specialRequest: "",
    });

  const loadHomestay = async () => {
    setLoadingProperty(true);
    setErrorMessage("");

    try {
      const response =
        await getHomestayById(id);

      setHomestay(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the selected property."
        )
      );
    } finally {
      setLoadingProperty(false);
    }
  };

  useEffect(() => {
    loadHomestay();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setBookingData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const nights = useMemo(() => {
    if (
      !bookingData.checkIn ||
      !bookingData.checkOut
    ) {
      return 1;
    }

    const checkInDate = new Date(
      bookingData.checkIn
    );

    const checkOutDate = new Date(
      bookingData.checkOut
    );

    const difference =
      checkOutDate.getTime() -
      checkInDate.getTime();

    const calculatedNights =
      difference / (1000 * 60 * 60 * 24);

    return calculatedNights > 0
      ? calculatedNights
      : 1;
  }, [
    bookingData.checkIn,
    bookingData.checkOut,
  ]);

  const pricePerNight = Number(
    homestay?.pricePerNight || 0
  );

  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + serviceFee;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userLoggedIn) {
      setErrorMessage(
        "Please sign in from the homepage before booking."
      );
      return;
    }

    if (loggedInUser?.role !== "USER") {
      setErrorMessage(
        "Only traveller accounts can create bookings."
      );
      return;
    }

    if (
      bookingData.checkOut <=
      bookingData.checkIn
    ) {
      setErrorMessage(
        "Check-out date must be after check-in date."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createBooking({
        homestayId: Number(id),
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: Number(bookingData.guests),
        specialRequest:
          bookingData.specialRequest.trim(),
      });

      setCompletedBooking(response);
      setBookingComplete(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to complete the booking."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProperty) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading booking information</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (!homestay) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <RefreshCw size={42} />
          <h1>Property not found</h1>
          <p>{errorMessage}</p>

          <Link to="/homestays">
            Browse homestays
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  if (bookingComplete && completedBooking) {
    return (
      <>
        <Navbar />

        <main className="booking-success-page">
          <div className="booking-success-card">
            <CheckCircle
              size={65}
              strokeWidth={1.5}
            />

            <p className="section-small-title">
              BOOKING SUBMITTED
            </p>

            <h1>Your booking is pending</h1>

            <p>
              Your booking for{" "}
              <strong>
                {completedBooking.homestayName}
              </strong>{" "}
              was submitted successfully. The Client
              will review and confirm it.
            </p>

            <div className="booking-success-details">
              <span>
                Booking number:{" "}
                <strong>
                  {completedBooking.bookingNumber}
                </strong>
              </span>

              <span>
                <CalendarDays size={19} />
                {completedBooking.checkIn} to{" "}
                {completedBooking.checkOut}
              </span>

              <span>
                <Users size={19} />
                {completedBooking.guests} guests
              </span>

              <strong>
                Total: ₹
                {Number(
                  completedBooking.totalAmount
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="booking-success-actions">
              <Link to="/bookings">
                View my bookings
              </Link>

              <Link to="/">
                Return to homepage
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="booking-page">
        <div className="booking-page-heading">
          <p className="section-small-title">
            COMPLETE YOUR BOOKING
          </p>

          <h1>Reserve your stay</h1>

          <p>
            Review your profile information and stay
            details.
          </p>
        </div>

        <div className="booking-layout">
          <form
            className="booking-form"
            onSubmit={handleSubmit}
          >
            {errorMessage && (
              <div
                className="auth-api-error"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {!userLoggedIn && (
              <div className="booking-login-warning">
                <strong>Sign-in required</strong>

                <p>
                  Return to the homepage and use the
                  Sign In button before confirming
                  this booking.
                </p>

                <Link to="/">
                  Return to homepage
                </Link>
              </div>
            )}

            <div className="booking-form-section">
              <h2>Guest information</h2>

              <div className="booking-form-group">
                <label>Full name</label>

                <input
                  type="text"
                  value={
                    loggedInUser?.fullName || ""
                  }
                  placeholder="Sign in to continue"
                  readOnly
                />
              </div>

              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label>Email address</label>

                  <input
                    type="email"
                    value={
                      loggedInUser?.email || ""
                    }
                    readOnly
                  />
                </div>

                <div className="booking-form-group">
                  <label>Phone number</label>

                  <input
                    type="tel"
                    value={
                      loggedInUser?.phone || ""
                    }
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="booking-form-section">
              <h2>Stay information</h2>

              <div className="booking-form-row">
                <div className="booking-form-group">
                  <label htmlFor="bookingCheckIn">
                    Check in
                  </label>

                  <input
                    id="bookingCheckIn"
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-form-group">
                  <label htmlFor="bookingCheckOut">
                    Check out
                  </label>

                  <input
                    id="bookingCheckOut"
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="booking-form-group">
                <label htmlFor="bookingGuests">
                  Number of guests
                </label>

                <input
                  id="bookingGuests"
                  type="number"
                  name="guests"
                  min="1"
                  max={homestay.guests}
                  value={bookingData.guests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-form-group">
                <label htmlFor="specialRequest">
                  Special request (optional)
                </label>

                <textarea
                  id="specialRequest"
                  name="specialRequest"
                  rows="4"
                  maxLength="1000"
                  placeholder="Tell us about any special requirements"
                  value={
                    bookingData.specialRequest
                  }
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="booking-agreement">
              <input
                type="checkbox"
                disabled={!userLoggedIn}
                required
              />

              I agree to the booking terms and
              cancellation policy.
            </label>

            <button
              type="submit"
              className="confirm-booking-button"
              disabled={
                submitting || !userLoggedIn
              }
            >
              {submitting
                ? "Submitting booking..."
                : "Confirm booking"}
            </button>
          </form>

          <aside className="booking-summary">
            <img
              src={homestay.image}
              alt={homestay.name}
            />

            <div className="booking-summary-content">
              <h2>{homestay.name}</h2>

              <p>
                <MapPin size={16} />
                {homestay.location}
              </p>

              <div className="booking-property-features">
                <span>
                  <Users size={17} />
                  {homestay.guests} guests
                </span>

                <span>
                  <BedDouble size={18} />
                  {homestay.bedrooms} bedrooms
                </span>
              </div>

              <div className="booking-price-details">
                <div>
                  <span>
                    ₹
                    {pricePerNight.toLocaleString(
                      "en-IN"
                    )}{" "}
                    × {nights} nights
                  </span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Service fee</span>

                  <strong>
                    ₹
                    {serviceFee.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="booking-total">
                  <span>Total amount</span>

                  <strong>
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default BookingPage;