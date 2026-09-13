import {
  ArrowUpRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import stayCategoryData from "../../data/stayCategoryData";
import "../../styles/stayCategories.css";
import "../../styles/contentManagementControls.css";

function StayCategories({
  clientMode = false,
  categories = stayCategoryData,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const visibleCategories = clientMode
    ? categories
    : categories.filter(
        (category) => category.active !== false
      );

  return (
    <section className="stay-categories-section">
      <div className="stay-categories-heading">
        <div>
          <p className="section-small-title">
            STAY YOUR WAY
          </p>

          <h2>
            Find a place for every kind of journey
          </h2>

          <p>
            From quiet mountain homes to private
            beach villas, choose a stay matching your
            journey.
          </p>
        </div>

        {clientMode && (
          <button
            type="button"
            className="content-add-button"
            onClick={onAdd}
            title="Add category"
            aria-label="Add category"
          >
            <Plus size={19} />
          </button>
        )}
      </div>

      {visibleCategories.length > 0 ? (
        <div className="stay-categories-grid">
          {visibleCategories.map(
            (category, index) => (
              <article
                className={`stay-category-card category-card-${
                  index + 1
                } ${
                  category.active === false
                    ? "client-inactive-content"
                    : ""
                }`}
                key={category.id}
              >
                <Link
                  to={`/homestays?category=${encodeURIComponent(
                    category.name
                  )}`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                  />

                  <div className="stay-category-overlay" />

                  <div className="stay-category-content">
                    <div>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>

                    <span className="category-arrow">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                </Link>

                {clientMode && (
                  <div className="content-management-actions">
                    <button
                      type="button"
                      className="content-action-button edit"
                      onClick={() =>
                        onEdit(category)
                      }
                      title="Edit category"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="content-action-button delete"
                      onClick={() =>
                        onDelete(category)
                      }
                      title="Delete category"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </article>
            )
          )}
        </div>
      ) : (
        <div className="client-empty-content">
          <p>No stay categories are available.</p>

          {clientMode && (
            <button type="button" onClick={onAdd}>
              <Plus size={18} />
              Add category
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default StayCategories;