import {
  Plus,
  Save,
  X,
} from "lucide-react";

function ClientContentModal({
  isOpen,
  action = "ADD",
  contentType = "Content",
  onClose,
  onSubmit,
  children,
}) {
  if (!isOpen) {
    return null;
  }

  const isAddAction = action === "ADD";

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <div
      className="client-popup-overlay"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <form
        className="client-content-popup"
        onSubmit={handleSubmit}
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-content-modal-title"
      >
        <button
          type="button"
          className="client-popup-close"
          onClick={onClose}
          aria-label="Close popup"
          title="Close"
        >
          <X size={21} />
        </button>

        <div className="client-modal-heading">
          <p className="section-small-title">
            {isAddAction
              ? "ADD CONTENT"
              : "UPDATE CONTENT"}
          </p>

          <h2 id="client-content-modal-title">
            {isAddAction ? "Add" : "Edit"} {contentType}
          </h2>
        </div>

        <div className="client-modal-form-content">
          {children}
        </div>

        <div className="client-modal-footer">
          <button
            type="button"
            className="client-modal-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="client-popup-submit"
          >
            {isAddAction ? (
              <Plus size={18} />
            ) : (
              <Save size={18} />
            )}

            {isAddAction
              ? `Add ${contentType}`
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientContentModal;