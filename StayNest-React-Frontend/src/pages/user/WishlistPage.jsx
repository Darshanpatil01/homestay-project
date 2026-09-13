import { useEffect, useState } from "react";
import {
  BedDouble,
  Heart,
  MapPin,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import {
  getMyWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import {
  getLoggedInUser,
  isAuthenticated,
} from "../../utils/authStorage";

import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/wishlistPage.css";
import "../../styles/pageApiState.css";
import "../../styles/authApiFeedback.css";

function WishlistPage() {
  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [removingId, setRemovingId] =
    useState(null);

  const loggedInUser = getLoggedInUser();

  const loadWishlist = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getMyWishlist();

      setWishlist(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load your wishlist."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (
    homestayId
  ) => {
    setRemovingId(homestayId);
    setErrorMessage("");

    try {
      await removeFromWishlist(
        homestayId
      );

      setWishlist((previousWishlist) =>
        previousWishlist.filter(
          (item) =>
            item.homestayId !== homestayId
        )
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to remove the homestay."
        )
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (!isAuthenticated()) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <Heart size={48} />

          <h1>Sign in to view your wishlist</h1>

          <p>
            Use the Sign In button on the homepage
            before saving your favourite homestays.
          </p>

          <Link to="/">
            Return to homepage
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  if (loggedInUser?.role !== "USER") {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <Heart size={48} />

          <h1>Traveller access required</h1>

          <p>
            Wishlist is available only for
            traveller accounts.
          </p>

          <Link to="/">
            Return to homepage
          </Link>
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
          <h1>Loading your wishlist</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="wishlist-page">
        <section className="wishlist-header">
          <div>
            <p className="section-small-title">
              SAVED FOR LATER
            </p>

            <h1>My wishlist</h1>

            <p>
              Welcome, {loggedInUser?.fullName}.
              Keep your favourite homestays together.
            </p>
          </div>
        </section>

        <section className="wishlist-content">
          {errorMessage && (
            <div
              className="auth-api-error"
              role="alert"
            >
              <RefreshCw size={18} />
              {errorMessage}
            </div>
          )}

          <div className="wishlist-content-heading">
            <div>
              <h2>Saved homestays</h2>

              <p>
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "property saved"
                  : "properties saved"}
              </p>
            </div>

            <Link to="/homestays">
              Explore more homestays
            </Link>
          </div>

          {wishlist.length > 0 ? (
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <article
                  className="wishlist-card"
                  key={item.wishlistId}
                >
                  <div className="wishlist-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <button
                      type="button"
                      disabled={
                        removingId ===
                        item.homestayId
                      }
                      onClick={() =>
                        handleRemove(
                          item.homestayId
                        )
                      }
                      aria-label={`Remove ${item.name} from wishlist`}
                      title="Remove from wishlist"
                    >
                      <Heart
                        size={20}
                        fill="currentColor"
                      />
                    </button>
                  </div>

                  <div className="wishlist-card-content">
                    <div className="wishlist-location-row">
                      <span>
                        <MapPin size={14} />
                        {item.location}
                      </span>

                      <strong>
                        <Star
                          size={14}
                          fill="currentColor"
                        />
                        {item.rating || 0}
                      </strong>
                    </div>

                    <h3>{item.name}</h3>

                    <div className="wishlist-features">
                      <span>
                        <Users size={17} />
                        {item.guests} guests
                      </span>

                      <span>
                        <BedDouble size={18} />
                        {item.bedrooms} bedrooms
                      </span>
                    </div>

                    <div className="wishlist-card-footer">
                      <p>
                        <strong>
                          ₹
                          {Number(
                            item.pricePerNight
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <span> / night</span>
                      </p>

                      <Link
                        to={`/homestays/${item.homestayId}`}
                      >
                        View property
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="wishlist-empty-state">
              <Heart
                size={50}
                strokeWidth={1.5}
              />

              <h2>Your wishlist is empty</h2>

              <p>
                Explore our homestays and save places
                you would love to visit.
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

export default WishlistPage;