function HeroForm({
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

  const imagePreview = URL.createObjectURL(selectedFile);

  onChange({
    ...formData,
    backgroundImage: selectedFile,
    backgroundImagePreview: imagePreview,
  });
};

  return (
    <>
      <div className="client-form-divider">
        Hero content
      </div>

      <label>
        Small title
        <input
          type="text"
          name="smallTitle"
          value={formData.smallTitle || ""}
          onChange={handleInputChange}
          placeholder="HANDPICKED HOMESTAYS ACROSS INDIA"
          required
        />
      </label>

      <div className="client-form-two-columns">
        <label>
          Main title
          <input
            type="text"
            name="mainTitle"
            value={formData.mainTitle || ""}
            onChange={handleInputChange}
            placeholder="Stay somewhere"
            required
          />
        </label>

        <label>
          Highlighted title
          <input
            type="text"
            name="highlightedTitle"
            value={formData.highlightedTitle || ""}
            onChange={handleInputChange}
            placeholder="worth remembering."
            required
          />
        </label>
      </div>

      <label>
        Description
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Enter the hero description"
          required
        />
      </label>

      <label>
        Background image
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageChange}
        />
      </label>

      <div className="client-form-divider">
        Search form content
      </div>

      <div className="client-form-two-columns">
        <label>
          Destination label
          <input
            type="text"
            name="destinationLabel"
            value={formData.destinationLabel || ""}
            onChange={handleInputChange}
            placeholder="WHERE"
            required
          />
        </label>

        <label>
          Destination placeholder
          <input
            type="text"
            name="destinationPlaceholder"
            value={formData.destinationPlaceholder || ""}
            onChange={handleInputChange}
            placeholder="Search destination"
            required
          />
        </label>

        <label>
          Check-in label
          <input
            type="text"
            name="checkInLabel"
            value={formData.checkInLabel || ""}
            onChange={handleInputChange}
            placeholder="CHECK IN"
            required
          />
        </label>

        <label>
          Check-out label
          <input
            type="text"
            name="checkOutLabel"
            value={formData.checkOutLabel || ""}
            onChange={handleInputChange}
            placeholder="CHECK OUT"
            required
          />
        </label>

        <label>
          Guests label
          <input
            type="text"
            name="guestsLabel"
            value={formData.guestsLabel || ""}
            onChange={handleInputChange}
            placeholder="GUESTS"
            required
          />
        </label>

        <label>
          Search button
          <input
            type="text"
            name="searchButtonLabel"
            value={formData.searchButtonLabel || ""}
            onChange={handleInputChange}
            placeholder="Search"
            required
          />
        </label>
      </div>
    </>
  );
}

export default HeroForm;