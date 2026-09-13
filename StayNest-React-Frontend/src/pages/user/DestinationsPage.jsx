import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { getPublicDestinations } from "../../services/destinationService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/destinationsPage.css";
import "../../styles/pageApiState.css";

function DestinationsPage() {
  const [destinations, setDestinations] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDestinations = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getPublicDestinations();

      setDestinations(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load destinations."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    const searchValue = searchText
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return destinations;
    }

    return destinations.filter(
      (destination) =>
        destination.name
          .toLowerCase()
          .includes(searchValue) ||
        destination.state
          .toLowerCase()
          .includes(searchValue)
    );
  }, [destinations, searchText]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading destinations</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <RefreshCw size={42} />
          <h1>Unable to load destinations</h1>
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={loadDestinations}
          >
            Try again
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="all-destinations-page">
        <section className="destinations-page-banner">
          <p className="section-small-title">
            DISCOVER INDIA
          </p>

          <h1>Destinations worth exploring</h1>

          <span>
            Find welcoming homes in mountains,
            beaches, forests and heritage towns.
          </span>
        </section>

        <section className="destinations-page-content">
          <div className="destinations-page-heading">
            <div>
              <h2>Explore destinations</h2>

              <p>
                {filteredDestinations.length}{" "}
                {filteredDestinations.length === 1
                  ? "destination"
                  : "destinations"}
              </p>
            </div>

            <div className="destination-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search destination or state"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </div>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="all-destinations-grid">
              {filteredDestinations.map(
                (destination) => (
                  <article
                    className="all-destination-card"
                    key={destination.id}
                  >
                    <Link
                      to={`/destinations/${destination.id}`}
                    >
                      <div className="all-destination-image">
                        <img
                          src={destination.image}
                          alt={destination.name}
                        />

                        <div className="destination-card-overlay" />
                      </div>

                      <div className="all-destination-content">
                        <p>
                          <MapPin size={15} />
                          {destination.state}
                        </p>

                        <h2>
                          {destination.name}
                        </h2>

                        <span>
                          {destination.description}
                        </span>

                        <div>
                          <strong>
                            {destination.propertyCount ||
                              0}{" "}
                            stays
                          </strong>

                          <ArrowRight size={19} />
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="page-api-empty">
              <Search size={42} />
              <h2>No destinations found</h2>
              <p>
                Try using a different destination or
                state name.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default DestinationsPage;