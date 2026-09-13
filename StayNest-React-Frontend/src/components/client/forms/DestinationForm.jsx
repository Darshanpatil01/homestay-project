function DestinationForm({
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

    updateField("imageFile", selectedFile);
  };

  return (
    <>
      <div className="client-form-divider">
        Destination information
      </div>

      <label>
        Destination name
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="For example: Goa"
          required
        />
      </label>

      <label>
        Short description
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Describe this destination"
          required
        />
      </label>

      <div className="client-form-two-columns">
        <label>
          State
          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleInputChange}
            placeholder="For example: Goa"
            required
          />
        </label>

        <label>
          Number of stays
          <input
            type="number"
            name="propertyCount"
            min="0"
            value={formData.propertyCount ?? ""}
            onChange={handleInputChange}
            placeholder="0"
            required
          />
        </label>
      </div>

      <label>
        Destination image
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageChange}
          required={!formData.id && !formData.image}
        />
      </label>

      {formData.image && (
        <div className="client-current-image">
          <p>Current image</p>

          <img
            src={`${formData.image}?auto=format&fit=crop&w=500&q=80`}
            alt={formData.name || "Destination preview"}
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

        <span>Display this destination on the website</span>
      </label>
    </>
  );
}

export default DestinationForm;