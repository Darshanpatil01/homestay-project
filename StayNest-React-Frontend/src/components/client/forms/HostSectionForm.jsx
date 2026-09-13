function HostSectionForm({
  formData,
  onChange,
}) {
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

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    updateField("backgroundImageFile", selectedFile);
  };

  return (
    <>
      <div className="client-form-divider">
        Host section content
      </div>

      <label>
        Small title
        <input
          type="text"
          name="smallTitle"
          value={formData.smallTitle || ""}
          onChange={handleInputChange}
          placeholder="BECOME A HOST"
          required
        />
      </label>

      <label>
        Main title
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="Share your home with travellers"
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          rows="5"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Explain why property owners should join"
          required
        />
      </label>

      <div className="client-form-two-columns">
        <label>
          Button text
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText || ""}
            onChange={handleInputChange}
            placeholder="List Your Property"
            required
          />
        </label>

        <label>
          Button link
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink || ""}
            onChange={handleInputChange}
            placeholder="/register?role=client"
            required
          />
        </label>
      </div>

      <label>
        Background image
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageChange}
        />
      </label>

      {formData.backgroundImage && (
        <div className="client-current-image">
          <p>Current background image</p>

          <img
            src={`${formData.backgroundImage}?auto=format&fit=crop&w=600&q=80`}
            alt="Host section background preview"
          />
        </div>
      )}

      <label className="client-checkbox-field">
        <input
          type="checkbox"
          checked={formData.active ?? true}
          onChange={(event) =>
            updateField("active", event.target.checked)
          }
        />

        <span>Display the host section on the website</span>
      </label>
    </>
  );
}

export default HostSectionForm;