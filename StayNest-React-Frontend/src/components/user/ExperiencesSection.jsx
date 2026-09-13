import {
  ArrowRight,
  ArrowUpRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import experienceData from "../../data/experienceData";
import "../../styles/experiencesSection.css";
import "../../styles/contentManagementControls.css";

function ExperiencesSection({
  clientMode = false,
  experiences = experienceData,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const visibleExperiences = clientMode
    ? experiences
    : experiences.filter(
        (experience) => experience.active !== false
      );

  return (
    <section className="experiences-section">
      <div className="experiences-heading">
        <div>
          <p className="section-small-title">
            MORE THAN A STAY
          </p>

          <h2>
            Experiences worth travelling for
          </h2>
        </div>

        <div className="section-heading-actions">
          {clientMode && (
            <button
              type="button"
              className="content-add-button"
              onClick={onAdd}
              title="Add experience"
              aria-label="Add experience"
            >
              <Plus size={19} />
            </button>
          )}

          <Link
            to="/experiences"
            className="experiences-view-all"
          >
            Explore all experiences
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {visibleExperiences.length > 0 ? (
        <div className="experiences-grid">
          {visibleExperiences.map((experience) => (
            <article
              className={`experience-card ${
                experience.active === false
                  ? "client-inactive-content"
                  : ""
              }`}
              key={experience.id}
            >
              <Link
                to={`/experiences/${experience.id}`}
              >
                <img
                  src={experience.image}
                  alt={experience.title}
                />

                <div className="experience-overlay" />

                <div className="experience-card-content">
                  <div>
                    <h3>{experience.title}</h3>
                    <p>{experience.description}</p>
                  </div>

                  <span className="experience-arrow">
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
                      onEdit(experience)
                    }
                    title="Edit experience"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className="content-action-button delete"
                    onClick={() =>
                      onDelete(experience)
                    }
                    title="Delete experience"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="client-empty-content">
          <p>No experiences are available.</p>

          {clientMode && (
            <button type="button" onClick={onAdd}>
              <Plus size={18} />
              Add experience
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default ExperiencesSection;