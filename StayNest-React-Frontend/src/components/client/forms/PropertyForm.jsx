function PropertyForm({
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
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    updateField("imageFiles", selectedFiles);
  };

  return (
    <>
      <div className="client-form-divider">
        Basic property information
      </div>

      <label>
        Property name
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="For example: Mountain View Villa"
          required
        />
      </label>

      <label>
        Property description
        <textarea
          name="description"
          rows="5"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Describe the property"
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
            required
          />
        </label>

        <label>
          State
          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleInputChange}
            placeholder="For example: Himachal Pradesh"
            required
          />
        </label>
      </div>

      <div className="client-form-divider">
        Price and capacity
      </div>

      <div className="client-form-two-columns">
        <label>
          Price per night
          <input
            type="number"
            name="pricePerNight"
            min="0"
            value={
              formData.pricePerNight ??
              formData.price ??
              ""
            }
            onChange={handleInputChange}
            placeholder="7500"
            required
          />
        </label>

        <label>
          Maximum guests
          <input
            type="number"
            name="guests"
            min="1"
            value={formData.guests ?? ""}
            onChange={handleInputChange}
            placeholder="4"
            required
          />
        </label>

        <label>
          Bedrooms
          <input
            type="number"
            name="bedrooms"
            min="1"
            value={formData.bedrooms ?? ""}
            onChange={handleInputChange}
            placeholder="2"
            required
          />
        </label>

        <label>
          Bathrooms
          <input
            type="number"
            name="bathrooms"
            min="1"
            value={formData.bathrooms ?? ""}
            onChange={handleInputChange}
            placeholder="2"
            required
          />
        </label>

        <label>
          Minimum stay
          <input
            type="number"
            name="minimumStay"
            min="1"
            value={formData.minimumStay ?? ""}
            onChange={handleInputChange}
            placeholder="1"
          />
        </label>

        <label>
          Property category
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            <option value="Mountain Escape">
              Mountain Escape
            </option>
            <option value="Beach Retreat">
              Beach Retreat
            </option>
            <option value="Heritage Home">
              Heritage Home
            </option>
            <option value="Nature Stay">
              Nature Stay
            </option>
            <option value="Luxury Villa">
              Luxury Villa
            </option>
          </select>
        </label>
      </div>

      <div className="client-form-divider">
        Amenities and policies
      </div>

      <label>
        Amenities
        <input
          type="text"
          name="amenities"
          value={
            Array.isArray(formData.amenities)
              ? formData.amenities.join(", ")
              : formData.amenities || ""
          }
          onChange={handleInputChange}
          placeholder="WiFi, Parking, Kitchen, Pool"
        />

        <small className="client-field-help">
          Separate multiple amenities using commas.
        </small>
      </label>

      <div className="client-checkbox-list">
        <label className="client-checkbox-field">
          <input
            type="checkbox"
            checked={formData.petFriendly ?? false}
            onChange={(event) =>
              updateField(
                "petFriendly",
                event.target.checked
              )
            }
          />

          <span>Pet-friendly property</span>
        </label>

        <label className="client-checkbox-field">
          <input
            type="checkbox"
            checked={formData.featured ?? false}
            onChange={(event) =>
              updateField(
                "featured",
                event.target.checked
              )
            }
          />

          <span>Show as guest favourite</span>
        </label>

        <label className="client-checkbox-field">
          <input
            type="checkbox"
            checked={formData.active ?? true}
            onChange={(event) =>
              updateField("active", event.target.checked)
            }
          />

          <span>Display this property on the website</span>
        </label>
      </div>

      <div className="client-form-divider">
        Property images
      </div>

      <label>
        Upload images
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          multiple
          onChange={handleImageChange}
          required={!formData.id && !formData.image}
        />

        <small className="client-field-help">
          You can select multiple property images.
        </small>
      </label>

      {formData.image && (
        <div className="client-current-image">
          <p>Current primary image</p>

          <img
            src={`${formData.image}?auto=format&fit=crop&w=500&q=80`}
            alt={formData.name || "Property preview"}
          />
        </div>
      )}
    </>
  );
}

export default PropertyForm;