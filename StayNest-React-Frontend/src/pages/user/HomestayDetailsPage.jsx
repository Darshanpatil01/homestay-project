import { useEffect, useState } from "react";
import {
  Bath,
  BedDouble,
  Car,
  ChefHat,
  Heart,
  MapPin,
  RefreshCw,
  Star,
  Users,
  Wifi,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { getHomestayById } from "../../services/homestayService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/homestayDetailsPage.css";
import "../../styles/pageApiState.css";

function HomestayDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [homestay, setHomestay] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [bookingData, setBookingData] =
    useState({
      checkIn: "",
      checkOut: "",
      guests: 1,
    });

  const loadHomestay = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getHomestayById(id);

      setHomestay(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "The requested homestay was not found."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomestay();
  }, [id]);

  const handleBookingChange = (event) => {
    const { name, value } = event.target;

    setBookingData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleBooking = (event) => {
    event.preventDefault();

    if (
      bookingData.checkOut <=
      bookingData.checkIn
    ) {
      alert(
        "Check-out date must be after check-in date."
      );
      return;
    }

    const parameters = new URLSearchParams({
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
    });

    navigate(
      `/booking/${homestay.id}?${parameters.toString()}`
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading property</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (errorMessage || !homestay) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <RefreshCw size={42} />
          <h1>Homestay not found</h1>
          <p>{errorMessage}</p>

          <Link to="/homestays">
            Return to homestays
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="property-details-page">
        <section className="property-heading">
          <div>
            <p className="property-location">
              <MapPin size={17} />
              {homestay.location}
            </p>

            <h1>{homestay.name}</h1>

            <div className="property-rating">
              <Star
                size={17}
                fill="currentColor"
              />

              <strong>
                {homestay.rating || 0}
              </strong>

              {homestay.featured && (
                <span>Guest favourite</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="details-wishlist-button"
          >
            <Heart size={19} />
            Save
          </button>
        </section>

        <section className="property-gallery">
          <img
            className="property-main-image"
            src={homestay.image}
            alt={homestay.name}
          />

          <img
            src={homestay.image}
            alt={`${homestay.name} view`}
          />

          <img
            src={homestay.image}
            alt={`${homestay.name} interior`}
          />
        </section>

        <section className="property-main-content">
          <div className="property-information">
            <div className="property-summary">
              <span>
                <Users size={22} />
                <strong>{homestay.guests}</strong>
                Guests
              </span>

              <span>
                <BedDouble size={23} />
                <strong>
                  {homestay.bedrooms}
                </strong>
                Bedrooms
              </span>

              <span>
                <Bath size={22} />
                <strong>
                  {homestay.bathrooms}
                </strong>
                Bathrooms
              </span>

              <span>
                <Star size={22} />
                <strong>
                  {homestay.rating || 0}
                </strong>
                Rating
              </span>
            </div>

            <div className="property-section">
              <h2>About this stay</h2>
              <p>{homestay.description}</p>
            </div>

            <div className="property-section">
              <h2>Amenities</h2>

              <div className="amenities-grid">
                <span>
                  <Wifi size={21} />
                  Free Wi-Fi
                </span>

                <span>
                  <Car size={21} />
                  Free parking
                </span>

                <span>
                  <ChefHat size={21} />
                  Home-cooked meals
                </span>

                <span>
                  <Users size={21} />
                  Family friendly
                </span>
              </div>
            </div>
          </div>

          <aside className="booking-card">
            <div className="booking-price">
              <strong>
                ₹
                {Number(
                  homestay.pricePerNight
                ).toLocaleString("en-IN")}
              </strong>

              <span>/ night</span>
            </div>

            <form onSubmit={handleBooking}>
              <div className="booking-date-row">
                <label htmlFor="detailsCheckIn">
                  CHECK IN

                  <input
                    id="detailsCheckIn"
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={
                      handleBookingChange
                    }
                    required
                  />
                </label>

                <label htmlFor="detailsCheckOut">
                  CHECK OUT

                  <input
                    id="detailsCheckOut"
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={
                      handleBookingChange
                    }
                    required
                  />
                </label>
              </div>

              <label htmlFor="detailsGuests">
                GUESTS

                <input
                  id="detailsGuests"
                  type="number"
                  name="guests"
                  min="1"
                  max={homestay.guests}
                  value={bookingData.guests}
                  onChange={handleBookingChange}
                  required
                />
              </label>

              <button type="submit">
                Reserve this stay
              </button>
            </form>

            <p>
              The booking will remain pending until
              confirmed.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomestayDetailsPage;