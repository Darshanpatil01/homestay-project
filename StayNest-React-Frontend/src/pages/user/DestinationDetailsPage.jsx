import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  MapPin,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { getDestinationById } from "../../services/destinationService";
import { getPublicHomestays } from "../../services/homestayService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/destinationDetailsPage.css";
import "../../styles/pageApiState.css";

function DestinationDetailsPage() {
  const { id } = useParams();

  const [destination, setDestination] =
    useState(null);

  const [homestays, setHomestays] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDestination = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [
        destinationResponse,
        homestayResponse,
      ] = await Promise.all([
        getDestinationById(id),
        getPublicHomestays(),
      ]);

      setDestination(destinationResponse);
      setHomestays(homestayResponse);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load this destination."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestination();
  }, [id]);

  const destinationHomestays =
    useMemo(() => {
      if (!destination) {
        return [];
      }

      const destinationName =
        destination.name.toLowerCase();

      return homestays.filter((homestay) =>
        homestay.location
          .toLowerCase()
          .includes(destinationName)
      );
    }, [destination, homestays]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading destination</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (!destination) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <RefreshCw size={42} />
          <h1>Destination not found</h1>
          <p>{errorMessage}</p>

          <Link to="/destinations">
            View destinations
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="destination-details-page">
        <section
          className="destination-details-hero"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(8, 31, 24, 0.48),
                rgba(8, 31, 24, 0.68)
              ),
              url("${destination.image}")
            `,
          }}
        >
          <div>
            <p>
              <MapPin size={17} />
              {destination.state}
            </p>

            <h1>{destination.name}</h1>

            <span>
              {destination.description}
            </span>
          </div>
        </section>

        <section className="destination-property-section">
          <div className="destination-property-heading">
            <div>
              <p className="section-small-title">
                PLACES TO STAY
              </p>

              <h2>
                Homestays in {destination.name}
              </h2>

              <span>
                {destinationHomestays.length}{" "}
                properties available
              </span>
            </div>

            <Link
              to={`/homestays?search=${encodeURIComponent(
                destination.name
              )}`}
            >
              Browse all
              <ArrowRight size={18} />
            </Link>
          </div>

          {destinationHomestays.length > 0 ? (
            <div className="destination-homestay-grid">
              {destinationHomestays.map(
                (homestay) => (
                  <article
                    className="destination-homestay-card"
                    key={homestay.id}
                  >
                    <img
                      src={homestay.image}
                      alt={homestay.name}
                    />

                    <div>
                      <p>
                        <MapPin size={14} />
                        {homestay.location}
                      </p>

                      <h3>{homestay.name}</h3>

                      <div className="destination-stay-features">
                        <span>
                          <Users size={16} />
                          {homestay.guests} guests
                        </span>

                        <span>
                          <BedDouble size={17} />
                          {homestay.bedrooms} bedrooms
                        </span>

                        <span>
                          <Star
                            size={15}
                            fill="currentColor"
                          />
                          {homestay.rating || 0}
                        </span>
                      </div>

                      <div className="destination-stay-footer">
                        <strong>
                          ₹
                          {Number(
                            homestay.pricePerNight
                          ).toLocaleString(
                            "en-IN"
                          )}
                          <small> / night</small>
                        </strong>

                        <Link
                          to={`/homestays/${homestay.id}`}
                        >
                          View property
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="page-api-empty">
              <h2>No homestays available yet</h2>

              <p>
                Properties for this destination will
                be added soon.
              </p>

              <Link to="/homestays">
                Explore other homestays
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default DestinationDetailsPage;