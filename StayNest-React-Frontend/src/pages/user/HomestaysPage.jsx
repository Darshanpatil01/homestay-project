import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Heart,
  MapPin,
  RefreshCw,
  Search,
  Star,
  Users,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { getPublicHomestays } from "../../services/homestayService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/homestaysPage.css";
import "../../styles/pageApiState.css";

function HomestaysPage() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );

  const [destination, setDestination] =
    useState("ALL");

  const [category, setCategory] = useState(
    searchParams.get("category") || "ALL"
  );

  const [maximumPrice, setMaximumPrice] =
    useState("ALL");

  const [minimumGuests, setMinimumGuests] =
    useState(
      Number(searchParams.get("guests")) || 1
    );

  const [sortOption, setSortOption] =
    useState("RECOMMENDED");

  const loadHomestays = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getPublicHomestays();

      setHomestays(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load homestays."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomestays();
  }, []);

  const destinationOptions = useMemo(() => {
    return [
      ...new Set(
        homestays
          .map((homestay) => homestay.location)
          .filter(Boolean)
      ),
    ];
  }, [homestays]);

  const categoryOptions = useMemo(() => {
    return [
      ...new Set(
        homestays
          .map((homestay) => homestay.category)
          .filter(Boolean)
      ),
    ];
  }, [homestays]);

  const filteredHomestays = useMemo(() => {
    const filtered = homestays.filter(
      (homestay) => {
        const text = searchText
          .trim()
          .toLowerCase();

        const matchesSearch =
          !text ||
          homestay.name
            .toLowerCase()
            .includes(text) ||
          homestay.location
            .toLowerCase()
            .includes(text);

        const matchesDestination =
          destination === "ALL" ||
          homestay.location === destination;

        const matchesCategory =
          category === "ALL" ||
          homestay.category === category;

        const matchesPrice =
          maximumPrice === "ALL" ||
          Number(homestay.pricePerNight) <=
            Number(maximumPrice);

        const matchesGuests =
          Number(homestay.guests) >=
          Number(minimumGuests);

        return (
          matchesSearch &&
          matchesDestination &&
          matchesCategory &&
          matchesPrice &&
          matchesGuests
        );
      }
    );

    return [...filtered].sort((first, second) => {
      if (sortOption === "PRICE_LOW") {
        return (
          Number(first.pricePerNight) -
          Number(second.pricePerNight)
        );
      }

      if (sortOption === "PRICE_HIGH") {
        return (
          Number(second.pricePerNight) -
          Number(first.pricePerNight)
        );
      }

      if (sortOption === "RATING") {
        return (
          Number(second.rating) -
          Number(first.rating)
        );
      }

      return Number(second.featured) -
        Number(first.featured);
    });
  }, [
    homestays,
    searchText,
    destination,
    category,
    maximumPrice,
    minimumGuests,
    sortOption,
  ]);

  const clearFilters = () => {
    setSearchText("");
    setDestination("ALL");
    setCategory("ALL");
    setMaximumPrice("ALL");
    setMinimumGuests(1);
    setSortOption("RECOMMENDED");
    setSearchParams({});
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading homestays</h1>
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
          <h1>Unable to load homestays</h1>
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={loadHomestays}
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

      <main className="homestays-page">
        <section className="homestays-banner">
          <p>HANDPICKED HOMES</p>
          <h1>Find your perfect homestay</h1>

          <span>
            Explore peaceful retreats, heritage
            homes and private villas across India.
          </span>
        </section>

        <section className="homestays-content">
          <aside className="homestay-filters">
            <div className="filter-heading">
              <h2>Filters</h2>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>

            <div className="filter-group">
              <label htmlFor="propertySearch">
                Search
              </label>

              <div className="filter-search-input">
                <Search size={18} />

                <input
                  id="propertySearch"
                  type="text"
                  placeholder="Property or location"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="destinationFilter">
                Destination
              </label>

              <select
                id="destinationFilter"
                value={destination}
                onChange={(event) =>
                  setDestination(event.target.value)
                }
              >
                <option value="ALL">
                  All destinations
                </option>

                {destinationOptions.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="categoryFilter">
                Category
              </label>

              <select
                id="categoryFilter"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option value="ALL">
                  All categories
                </option>

                {categoryOptions.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="priceFilter">
                Maximum price
              </label>

              <select
                id="priceFilter"
                value={maximumPrice}
                onChange={(event) =>
                  setMaximumPrice(event.target.value)
                }
              >
                <option value="ALL">
                  Any price
                </option>
                <option value="8000">
                  Up to ₹8,000
                </option>
                <option value="10000">
                  Up to ₹10,000
                </option>
                <option value="15000">
                  Up to ₹15,000
                </option>
                <option value="25000">
                  Up to ₹25,000
                </option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="guestFilter">
                Minimum guests
              </label>

              <input
                id="guestFilter"
                type="number"
                min="1"
                max="20"
                value={minimumGuests}
                onChange={(event) =>
                  setMinimumGuests(
                    Number(event.target.value) || 1
                  )
                }
              />
            </div>
          </aside>

          <div className="homestays-results">
            <div className="results-heading">
              <div>
                <p>AVAILABLE PROPERTIES</p>

                <h2>
                  {filteredHomestays.length}{" "}
                  {filteredHomestays.length === 1
                    ? "homestay found"
                    : "homestays found"}
                </h2>
              </div>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                aria-label="Sort homestays"
              >
                <option value="RECOMMENDED">
                  Recommended
                </option>
                <option value="PRICE_LOW">
                  Price: Low to High
                </option>
                <option value="PRICE_HIGH">
                  Price: High to Low
                </option>
                <option value="RATING">
                  Highest Rated
                </option>
              </select>
            </div>

            {filteredHomestays.length > 0 ? (
              <div className="all-homestays-grid">
                {filteredHomestays.map(
                  (homestay) => (
                    <article
                      className="listing-card"
                      key={homestay.id}
                    >
                      <div className="listing-image">
                        <img
                          src={homestay.image}
                          alt={homestay.name}
                        />

                        <button
                          type="button"
                          aria-label={`Save ${homestay.name}`}
                        >
                          <Heart size={20} />
                        </button>
                      </div>

                      <div className="listing-content">
                        <div className="listing-location">
                          <span>
                            <MapPin size={15} />
                            {homestay.location}
                          </span>

                          <strong>
                            <Star
                              size={14}
                              fill="currentColor"
                            />
                            {homestay.rating || 0}
                          </strong>
                        </div>

                        <h3>{homestay.name}</h3>

                        <div className="listing-features">
                          <span>
                            <Users size={17} />
                            {homestay.guests} guests
                          </span>

                          <span>
                            <BedDouble size={18} />
                            {homestay.bedrooms} bedrooms
                          </span>
                        </div>

                        <div className="listing-footer">
                          <p>
                            <strong>
                              ₹
                              {Number(
                                homestay.pricePerNight
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            <span>/ night</span>
                          </p>

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
              <div className="no-properties-found">
                <Search size={38} />
                <h3>No homestays found</h3>
                <p>
                  Try changing your search or filter
                  options.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomestaysPage;