import {
  ArrowRight,
  BedDouble,
  Heart,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import homestayData from "../../data/homestayData";
import "../../styles/featuredHomestays.css";
import "../../styles/contentManagementControls.css";

function FeaturedHomestays({
  clientMode = false,
  homestays = homestayData,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const visibleHomestays = clientMode
    ? homestays
    : homestays.filter(
        (homestay) =>
          homestay.status === undefined ||
          homestay.status === "ACTIVE"
      );

  return (
    <section className="featured-section">
      <div className="featured-heading">
        <div>
          <p className="section-small-title">
            CURATED FOR YOU
          </p>

          <h2>Homes with a point of view</h2>
        </div>

        <div className="section-heading-actions">
          {clientMode && (
            <button
              type="button"
              className="content-add-button"
              onClick={onAdd}
              title="Add homestay"
              aria-label="Add homestay"
            >
              <Plus size={19} />
            </button>
          )}

          <Link
            to="/homestays"
            className="view-all-link"
          >
            Browse all stays
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {visibleHomestays.length > 0 ? (
        <div className="homestay-grid">
          {visibleHomestays.map((homestay) => (
            <article
              className={`homestay-card ${
                homestay.status &&
                homestay.status !== "ACTIVE"
                  ? "client-inactive-content"
                  : ""
              }`}
              key={homestay.id}
            >
              <div className="homestay-image-container">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="homestay-image"
                />

                {homestay.featured && (
                  <span className="featured-badge">
                    Guest favourite
                  </span>
                )}

                {!clientMode && (
                  <button
                    type="button"
                    className="wishlist-button"
                    aria-label={`Add ${homestay.name} to wishlist`}
                  >
                    <Heart size={20} />
                  </button>
                )}

                {clientMode && (
                  <div className="content-management-actions">
                    <button
                      type="button"
                      className="content-action-button edit"
                      onClick={() =>
                        onEdit(homestay)
                      }
                      title="Edit property"
                      aria-label={`Edit ${homestay.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="content-action-button delete"
                      onClick={() =>
                        onDelete(homestay)
                      }
                      title="Delete property"
                      aria-label={`Delete ${homestay.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="homestay-card-content">
                <div className="homestay-title-row">
                  <div>
                    <p className="homestay-location">
                      <MapPin size={15} />
                      {homestay.location}
                    </p>

                    <h3>{homestay.name}</h3>
                  </div>

                  <span className="homestay-rating">
                    <Star
                      size={15}
                      fill="currentColor"
                    />
                    {homestay.rating || 0}
                  </span>
                </div>

                <div className="homestay-information">
                  <span>
                    <Users size={17} />
                    {homestay.guests} guests
                  </span>

                  <span>
                    <BedDouble size={18} />
                    {homestay.bedrooms} bedrooms
                  </span>

                  <strong>
                    ₹
                    {Number(
                      homestay.pricePerNight
                    ).toLocaleString("en-IN")}
                    <small> / night</small>
                  </strong>
                </div>

                <Link
                  to={`/homestays/${homestay.id}`}
                  className="view-property-button"
                >
                  View property
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="client-empty-content">
          <p>No featured homestays are available.</p>

          {clientMode && (
            <button type="button" onClick={onAdd}>
              <Plus size={18} />
              Add property
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default FeaturedHomestays;