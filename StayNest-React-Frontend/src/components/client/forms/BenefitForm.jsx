function BenefitForm({
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
        Benefit information
      </div>

      <label>
        Benefit title
        <input
          type="text"
          name="title"
          value={
            formData.title ||
            formData.name ||
            ""
          }
          onChange={handleInputChange}
          placeholder="For example: Verified Homestays"
          required
        />
      </label>

      <label>
        Benefit description
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Explain this benefit"
          required
        />
      </label>

      <label>
        Benefit icon
        <select
          name="icon"
          value={formData.icon || ""}
          onChange={handleInputChange}
          required
        >
          <option value="">Select an icon</option>
          <option value="shield-check">
            Verified shield
          </option>
          <option value="lock">
            Secure booking
          </option>
          <option value="heart">
            Carefully selected
          </option>
          <option value="users">
            Direct host connection
          </option>
          <option value="map-pin">
            Local experiences
          </option>
          <option value="headphones">
            Customer support
          </option>
          <option value="badge-check">
            Quality assured
          </option>
        </select>
      </label>

      <label className="client-checkbox-field">
        <input
          type="checkbox"
          checked={formData.active ?? true}
          onChange={(event) =>
            updateField("active", event.target.checked)
          }
        />

        <span>Display this benefit on the website</span>
      </label>
    </>
  );
}

export default BenefitForm;