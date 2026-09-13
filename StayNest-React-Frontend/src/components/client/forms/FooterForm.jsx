function FooterForm({
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

  const handleLogoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    updateField("logoFile", selectedFile);
  };

  return (
    <>
      <div className="client-form-divider">
        Footer brand information
      </div>

      <label>
        Website name
        <input
          type="text"
          name="websiteName"
          value={formData.websiteName || ""}
          onChange={handleInputChange}
          placeholder="StayNest"
          required
        />
      </label>

      <label>
        Footer description
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Enter a short description about the website"
          required
        />
      </label>

      <label>
        Footer logo
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleLogoChange}
        />
      </label>

      <div className="client-form-divider">
        Contact information
      </div>

      <label>
        Address
        <textarea
          name="address"
          rows="3"
          value={formData.address || ""}
          onChange={handleInputChange}
          placeholder="Enter business address"
          required
        />
      </label>

      <div className="client-form-two-columns">
        <label>
          Phone number
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="+91 98765 43210"
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            placeholder="hello@staynest.com"
            required
          />
        </label>
      </div>

      <div className="client-form-divider">
        Social media links
      </div>

      <div className="client-form-two-columns">
        <label>
          Instagram link
          <input
            type="url"
            name="instagramUrl"
            value={formData.instagramUrl || ""}
            onChange={handleInputChange}
            placeholder="https://instagram.com/"
          />
        </label>

        <label>
          Facebook link
          <input
            type="url"
            name="facebookUrl"
            value={formData.facebookUrl || ""}
            onChange={handleInputChange}
            placeholder="https://facebook.com/"
          />
        </label>

        <label>
          YouTube link
          <input
            type="url"
            name="youtubeUrl"
            value={formData.youtubeUrl || ""}
            onChange={handleInputChange}
            placeholder="https://youtube.com/"
          />
        </label>

        <label>
          X/Twitter link
          <input
            type="url"
            name="twitterUrl"
            value={formData.twitterUrl || ""}
            onChange={handleInputChange}
            placeholder="https://x.com/"
          />
        </label>
      </div>

      <div className="client-form-divider">
        Copyright
      </div>

      <label>
        Copyright text
        <input
          type="text"
          name="copyrightText"
          value={formData.copyrightText || ""}
          onChange={handleInputChange}
          placeholder="© 2026 StayNest. All rights reserved."
          required
        />
      </label>
    </>
  );
}

export default FooterForm;