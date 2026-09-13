import {
  ArrowRight,
  BadgeCheck,
  Home,
  Pencil,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import "../../styles/becomeHostSection.css";

const defaultHostData = {
  smallTitle: "BECOME A HOST",
  title: "A beautiful home deserves to be discovered.",
  description:
    "Join our community of property owners and share your home with travellers looking for authentic and memorable stays.",
  buttonText: "Register as a host",
  buttonLink: "/register?role=client",
  backgroundImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
};

function BecomeHostSection({
  clientMode = false,
  hostData = {},
  onEdit = () => {},
}) {
  const content = {
    ...defaultHostData,
    ...hostData,
  };

  return (
    <section className="become-host-section">
      <div className="become-host-image">
        <img
          src={content.backgroundImage}
          alt="Beautiful homestay property"
        />

        <div className="host-image-card">
          <Home size={25} />

          <div>
            <strong>List your property</strong>
            <span>Reach travellers across India</span>
          </div>
        </div>
      </div>

      <div className="become-host-content">
        <div className="host-title-controls">
          <p className="section-small-title">
            {content.smallTitle}
          </p>

          {clientMode && (
            <button
              type="button"
              className="host-edit-button"
              onClick={onEdit}
              aria-label="Edit host section"
              title="Edit host section"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>

        <h2>{content.title}</h2>

        <p className="host-description">
          {content.description}
        </p>

        <div className="host-benefits">
          <div>
            <BadgeCheck size={22} />
            <span>Verified host profile</span>
          </div>

          <div>
            <Home size={22} />
            <span>Manage your properties</span>
          </div>

          <div>
            <Users size={22} />
            <span>Connect with travellers</span>
          </div>
        </div>

        <Link
          to={content.buttonLink}
          className="become-host-button"
        >
          {content.buttonText}
          <ArrowRight size={19} />
        </Link>

        <p className="host-approval-message">
          Host accounts require administrator approval before
          property management features become available.
        </p>
      </div>
    </section>
  );
}

export default BecomeHostSection;