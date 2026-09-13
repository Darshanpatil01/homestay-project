import {
  ArrowRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import destinationData from "../../data/destinationData";
import "../../styles/popularDestinations.css";
import "../../styles/contentManagementControls.css";

function PopularDestinations({
  clientMode = false,
  destinations = destinationData,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const navigate = useNavigate();

  const visibleDestinations = clientMode
    ? destinations
    : destinations.filter(
        (destination) => destination.active !== false
      );

  return (
    <section className="destinations-section">
      <div className="destinations-heading">
        <div>
          <p className="section-small-title">
            EXPLORE INDIA
          </p>

          <h2>Places that pull you closer</h2>
        </div>

        <div className="section-heading-actions">
          {clientMode && (
            <button
              type="button"
              className="content-add-button"
              onClick={onAdd}
              title="Add destination"
              aria-label="Add destination"
            >
              <Plus size={19} />
            </button>
          )}

          <Link
            to="/destinations"
            className="view-all-link"
          >
            View all destinations
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {visibleDestinations.length > 0 ? (
        <div className="destinations-grid">
          {visibleDestinations.map(
            (destination, index) => (
              <article
                className={`destination-card ${
                  destination.active === false
                    ? "client-inactive-content"
                    : ""
                }`}
                key={destination.id}
                role="link"
                tabIndex={0}
                onClick={() =>
                  navigate(
                    `/destinations/${destination.id}`
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    navigate(
                      `/destinations/${destination.id}`
                    );
                  }
                }}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                />

                <div className="destination-overlay" />

                {clientMode && (
                  <div
                    className="content-management-actions"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <button
                      type="button"
                      className="content-action-button edit"
                      onClick={() =>
                        onEdit(destination)
                      }
                      title="Edit destination"
                      aria-label={`Edit ${destination.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="content-action-button delete"
                      onClick={() =>
                        onDelete(destination)
                      }
                      title="Delete destination"
                      aria-label={`Delete ${destination.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {destination.active === false &&
                  clientMode && (
                    <span className="content-hidden-badge">
                      Hidden
                    </span>
                  )}

                <span className="destination-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div className="destination-information">
                  <h3>{destination.name}</h3>

                  <p>
                    {destination.propertyCount || 0}{" "}
                    {(destination.propertyCount || 0) ===
                    1
                      ? "stay"
                      : "stays"}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      ) : (
        <ContentEmptyState
          clientMode={clientMode}
          message="No destinations are available."
          buttonLabel="Add destination"
          onAdd={onAdd}
        />
      )}
    </section>
  );
}

function ContentEmptyState({
  clientMode,
  message,
  buttonLabel,
  onAdd,
}) {
  return (
    <div className="client-empty-content">
      <p>{message}</p>

      {clientMode && (
        <button type="button" onClick={onAdd}>
          <Plus size={18} />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default PopularDestinations;