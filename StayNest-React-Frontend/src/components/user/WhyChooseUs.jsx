import {
  BadgeCheck,
  Handshake,
  Headphones,
  MapPinned,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import "../../styles/whyChooseUs.css";
import "../../styles/contentManagementControls.css";

const iconMap = {
  BadgeCheck,
  MapPinned,
  ShieldCheck,
  Handshake,
  Headphones,
};

const defaultBenefits = [
  {
    id: 1,
    title: "Verified Homestays",
    description:
      "Every property is reviewed before it is shown to travellers.",
    iconName: "BadgeCheck",
    active: true,
  },
];

function WhyChooseUs({
  clientMode = false,
  benefits = defaultBenefits,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const visibleBenefits = clientMode
    ? benefits
    : benefits.filter(
        (benefit) => benefit.active !== false
      );

  return (
    <section className="why-choose-section">
      <div className="why-choose-heading">
        <div>
          <p className="section-small-title">
            WHY STAYNEST?
          </p>

          <h2>Travel with confidence</h2>

          <p>
            We carefully select comfortable
            homestays and connect travellers with
            trusted local hosts.
          </p>
        </div>

        {clientMode && (
          <button
            type="button"
            className="content-add-button"
            onClick={onAdd}
            title="Add benefit"
            aria-label="Add benefit"
          >
            <Plus size={19} />
          </button>
        )}
      </div>

      {visibleBenefits.length > 0 ? (
        <div className="benefits-grid">
          {visibleBenefits.map((benefit) => {
            const Icon =
              iconMap[benefit.iconName] ||
              BadgeCheck;

            return (
              <article
                className={`benefit-card ${
                  benefit.active === false
                    ? "client-inactive-content"
                    : ""
                }`}
                key={benefit.id}
              >
                {clientMode && (
                  <div className="content-management-actions">
                    <button
                      type="button"
                      className="content-action-button edit"
                      onClick={() =>
                        onEdit(benefit)
                      }
                      title="Edit benefit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="content-action-button delete"
                      onClick={() =>
                        onDelete(benefit)
                      }
                      title="Delete benefit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <div className="benefit-icon">
                  <Icon
                    size={27}
                    strokeWidth={1.7}
                  />
                </div>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="client-empty-content">
          <p>No benefits are available.</p>

          {clientMode && (
            <button type="button" onClick={onAdd}>
              <Plus size={18} />
              Add benefit
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default WhyChooseUs;