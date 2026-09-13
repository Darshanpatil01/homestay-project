function TestimonialForm({
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
        Guest information
      </div>

      <div className="client-form-two-columns">
        <label>
          Guest name
          <input
            type="text"
            name="guestName"
            value={
              formData.guestName ||
              formData.name ||
              ""
            }
            onChange={handleInputChange}
            placeholder="Enter guest name"
            required
          />
        </label>

        <label>
          Guest location
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
            placeholder="For example: Mumbai"
          />
        </label>
      </div>

      <label>
        Guest review
        <textarea
          name="review"
          rows="5"
          value={
            formData.review ||
            formData.description ||
            ""
          }
          onChange={handleInputChange}
          placeholder="Enter the guest's experience"
          required
        />
      </label>

      <label>
        Rating
        <select
          name="rating"
          value={formData.rating || "5"}
          onChange={handleInputChange}
          required
        >
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </label>

      <label>
        Guest image
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageChange}
        />
      </label>

      {formData.image && (
        <div className="client-current-image">
          <p>Current guest image</p>

          <img
            src={`${formData.image}?auto=format&fit=crop&w=400&q=80`}
            alt={
              formData.guestName ||
              formData.name ||
              "Guest preview"
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

        <span>Display this testimonial on the website</span>
      </label>
    </>
  );
}

export default TestimonialForm;