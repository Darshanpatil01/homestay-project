function SectionHeadingForm({
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

  return (
    <>
      <div className="client-form-divider">
        Section heading
      </div>

      <label>
        Small title
        <input
          type="text"
          name="smallTitle"
          value={formData.smallTitle || ""}
          onChange={handleInputChange}
          placeholder="Enter small title"
          required
        />
      </label>

      <label>
        Main heading
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="Enter section heading"
          required
        />
      </label>

      <label>
        Section description
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Enter section description"
        />
      </label>

      {formData.showViewAllField && (
        <>
          <div className="client-form-divider">
            Section link
          </div>

          <div className="client-form-two-columns">
            <label>
              Link text
              <input
                type="text"
                name="viewAllText"
                value={formData.viewAllText || ""}
                onChange={handleInputChange}
                placeholder="View all"
              />
            </label>

            <label>
              Link path
              <input
                type="text"
                name="viewAllPath"
                value={formData.viewAllPath || ""}
                onChange={handleInputChange}
                placeholder="/page"
              />
            </label>
          </div>
        </>
      )}
    </>
  );
}

export default SectionHeadingForm;