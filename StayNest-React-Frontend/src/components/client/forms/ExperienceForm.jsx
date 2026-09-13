function ExperienceForm({
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
        Experience information
      </div>

      <label>
        Experience name
        <input
          type="text"
          name="name"
          value={
            formData.name ||
            formData.title ||
            ""
          }
          onChange={handleInputChange}
          placeholder="For example: Nature Trails"
          required
        />
      </label>

      <label>
        Experience description
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Describe this experience"
          required
        />
      </label>

      <div className="client-form-two-columns">
        <label>
          Location
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
            placeholder="For example: Manali"
          />
        </label>

        <label>
          Duration
          <input
            type="text"
            name="duration"
            value={formData.duration || ""}
            onChange={handleInputChange}
            placeholder="For example: 3 hours"
          />
        </label>
      </div>

      <label>
        Experience image
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
            alt={
              formData.name ||
              formData.title ||
              "Experience preview"
            }
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

        <span>Display this experience on the website</span>
      </label>
    </>
  );
}

export default ExperienceForm;