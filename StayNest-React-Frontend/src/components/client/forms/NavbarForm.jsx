import {
  Plus,
  Trash2,
} from "lucide-react";

function NavbarForm({
  formData,
  onChange,
}) {
  const navigationLinks =
    formData.navigationLinks || [];

  const updateField = (fieldName, value) => {
    onChange({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    updateField(name, value);
  };

  const updateNavigationLink = (
    index,
    fieldName,
    value
  ) => {
    const updatedLinks = navigationLinks.map(
      (link, linkIndex) =>
        linkIndex === index
          ? {
              ...link,
              [fieldName]: value,
            }
          : link
    );

    updateField("navigationLinks", updatedLinks);
  };

  const addNavigationLink = () => {
    const newLink = {
      id: Date.now(),
      label: "",
      path: "",
    };

    updateField("navigationLinks", [
      ...navigationLinks,
      newLink,
    ]);
  };

  const deleteNavigationLink = (linkId) => {
    const updatedLinks = navigationLinks.filter(
      (link) => link.id !== linkId
    );

    updateField("navigationLinks", updatedLinks);
  };

  const handleLogoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    updateField("logoImage", selectedFile);
  };

  return (
    <>
      <div className="client-form-divider">
        Website information
      </div>

      <label>
        Website name
        <input
          type="text"
          name="websiteName"
          value={formData.websiteName || ""}
          onChange={handleInputChange}
          placeholder="Enter website name"
          required
        />
      </label>

      <label>
        Website logo
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleLogoChange}
        />
      </label>

      <div className="client-form-section-heading">
        <div>
          <strong>Navigation links</strong>
          <small>
            Add, update or remove links from the Navbar.
          </small>
        </div>

        <button
          type="button"
          className="client-small-add-button"
          onClick={addNavigationLink}
          aria-label="Add navigation link"
          title="Add navigation link"
        >
          <Plus size={17} />
        </button>
      </div>

      <div className="navigation-link-list">
        {navigationLinks.length === 0 && (
          <div className="navigation-empty-message">
            No navigation links added.
          </div>
        )}

        {navigationLinks.map((link, index) => (
          <div
            className="navigation-link-form-row"
            key={link.id}
          >
            <span className="navigation-link-number">
              {index + 1}
            </span>

            <label>
              Link name
              <input
                type="text"
                value={link.label}
                onChange={(event) =>
                  updateNavigationLink(
                    index,
                    "label",
                    event.target.value
                  )
                }
                placeholder="For example: Gallery"
                required
              />
            </label>

            <label>
              Link path
              <input
                type="text"
                value={link.path}
                onChange={(event) =>
                  updateNavigationLink(
                    index,
                    "path",
                    event.target.value
                  )
                }
                placeholder="/gallery"
                required
              />
            </label>

            <button
              type="button"
              className="navigation-link-delete-button"
              onClick={() =>
                deleteNavigationLink(link.id)
              }
              aria-label={`Delete ${
                link.label || "navigation link"
              }`}
              title="Delete navigation link"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

      <div className="client-form-divider">
        Navbar buttons
      </div>

      <div className="client-form-two-columns">
        <label>
          Sign-in button
          <input
            type="text"
            name="signInLabel"
            value={formData.signInLabel || ""}
            onChange={handleInputChange}
            placeholder="Sign In"
            required
          />
        </label>

        <label>
          Host button
          <input
            type="text"
            name="hostButtonLabel"
            value={formData.hostButtonLabel || ""}
            onChange={handleInputChange}
            placeholder="List Your Property"
            required
          />
        </label>
      </div>
    </>
  );
}

export default NavbarForm;