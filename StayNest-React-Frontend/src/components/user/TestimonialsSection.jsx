import {
  Pencil,
  Plus,
  Quote,
  Star,
  Trash2,
} from "lucide-react";

import testimonialData from "../../data/testimonialData";
import "../../styles/testimonialsSection.css";
import "../../styles/contentManagementControls.css";

function TestimonialsSection({
  clientMode = false,
  testimonials = testimonialData,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const visibleTestimonials = clientMode
    ? testimonials
    : testimonials.filter(
        (testimonial) =>
          testimonial.active !== false
      );

  return (
    <section className="testimonials-section">
      <div className="testimonials-heading">
        <div>
          <p className="section-small-title">
            GUEST STORIES
          </p>

          <h2>
            Memories shared by our travellers
          </h2>

          <p>
            Read what guests experienced while
            staying in our handpicked homes.
          </p>
        </div>

        {clientMode && (
          <button
            type="button"
            className="content-add-button"
            onClick={onAdd}
            title="Add testimonial"
            aria-label="Add testimonial"
          >
            <Plus size={19} />
          </button>
        )}
      </div>

      {visibleTestimonials.length > 0 ? (
        <div className="testimonials-grid">
          {visibleTestimonials.map(
            (testimonial) => (
              <article
                className={`testimonial-card ${
                  testimonial.active === false
                    ? "client-inactive-content"
                    : ""
                }`}
                key={testimonial.id}
              >
                {clientMode && (
                  <div className="content-management-actions">
                    <button
                      type="button"
                      className="content-action-button edit"
                      onClick={() =>
                        onEdit(testimonial)
                      }
                      title="Edit testimonial"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="content-action-button delete"
                      onClick={() =>
                        onDelete(testimonial)
                      }
                      title="Delete testimonial"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <Quote
                  className="quote-icon"
                  size={40}
                  strokeWidth={1.4}
                />

                <div className="testimonial-rating">
                  {Array.from({
                    length: testimonial.rating || 0,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={17}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <p className="testimonial-comment">
                  “{testimonial.comment}”
                </p>

                <div className="testimonial-customer">
                  {testimonial.guestImage ? (
                    <img
                      className="customer-profile-image"
                      src={testimonial.guestImage}
                      alt={testimonial.guestName}
                    />
                  ) : (
                    <div className="customer-initials">
                      {testimonial.initials}
                    </div>
                  )}

                  <div>
                    <h3>
                      {testimonial.guestName ||
                        testimonial.name}
                    </h3>

                    <p>
                      {testimonial.guestLocation ||
                        testimonial.location}
                    </p>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      ) : (
        <div className="client-empty-content">
          <p>No testimonials are available.</p>

          {clientMode && (
            <button type="button" onClick={onAdd}>
              <Plus size={18} />
              Add testimonial
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default TestimonialsSection;