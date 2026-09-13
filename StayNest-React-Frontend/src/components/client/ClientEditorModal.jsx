import { useEffect, useState } from "react";
import {
  Image,
  LoaderCircle,
  Save,
  Upload,
  X,
} from "lucide-react";

import "../../styles/clientEditorModal.css";

const fieldConfigurations = {
  navbar: [
    {
      name: "websiteName",
      label: "Website name",
      type: "text",
      required: true,
    },
    {
      name: "signInLabel",
      label: "Sign-in button label",
      type: "text",
      required: true,
    },
    {
      name: "clientButtonLabel",
      label: "Client button label",
      type: "text",
      required: true,
    },
  ],

  hero: [
    {
      name: "heroSmallTitle",
      label: "Small title",
      type: "text",
      required: true,
    },
    {
      name: "heroTitle",
      label: "Main title",
      type: "text",
      required: true,
    },
    {
      name: "heroHighlightedText",
      label: "Highlighted title",
      type: "text",
    },
    {
      name: "heroDescription",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "heroImage",
      label: "Hero image",
      type: "image",
      folder: "website",
    },
  ],

  footer: [
    {
      name: "footerDescription",
      label: "Footer description",
      type: "textarea",
      required: true,
    },
    {
      name: "contactEmail",
      label: "Contact email",
      type: "email",
    },
    {
      name: "contactPhone",
      label: "Contact phone",
      type: "text",
    },
    {
      name: "contactAddress",
      label: "Contact address",
      type: "textarea",
    },
  ],

  destination: [
    {
      name: "name",
      label: "Destination name",
      type: "text",
      required: true,
    },
    {
      name: "state",
      label: "State",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      label: "Destination image",
      type: "image",
      folder: "destinations",
    },
    {
      name: "propertyCount",
      label: "Property count",
      type: "number",
      min: 0,
    },
    {
      name: "displayOrder",
      label: "Display order",
      type: "number",
      min: 0,
    },
    {
      name: "active",
      label: "Visible on website",
      type: "checkbox",
    },
  ],

  homestay: [
    {
      name: "name",
      label: "Property name",
      type: "text",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      label: "Property image",
      type: "image",
      folder: "homestays",
    },
    {
      name: "pricePerNight",
      label: "Price per night",
      type: "number",
      min: 1,
      required: true,
    },
    {
      name: "guests",
      label: "Maximum guests",
      type: "number",
      min: 1,
      required: true,
    },
    {
      name: "bedrooms",
      label: "Bedrooms",
      type: "number",
      min: 1,
      required: true,
    },
    {
      name: "bathrooms",
      label: "Bathrooms",
      type: "number",
      min: 1,
      required: true,
    },
    {
      name: "rating",
      label: "Rating",
      type: "number",
      min: 0,
      max: 5,
      step: 0.1,
    },
    {
      name: "featured",
      label: "Featured property",
      type: "checkbox",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        "ACTIVE",
        "HIDDEN",
        "UNAVAILABLE",
      ],
    },
  ],

  category: [
    {
      name: "name",
      label: "Category name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      label: "Category image",
      type: "image",
      folder: "categories",
    },
    {
      name: "displayOrder",
      label: "Display order",
      type: "number",
      min: 0,
    },
    {
      name: "active",
      label: "Visible on website",
      type: "checkbox",
    },
  ],

  experience: [
    {
      name: "title",
      label: "Experience title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      label: "Experience image",
      type: "image",
      folder: "experiences",
    },
    {
      name: "displayOrder",
      label: "Display order",
      type: "number",
      min: 0,
    },
    {
      name: "active",
      label: "Visible on website",
      type: "checkbox",
    },
  ],

  benefit: [
    {
      name: "title",
      label: "Benefit title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "iconName",
      label: "Icon",
      type: "select",
      options: [
        "BadgeCheck",
        "MapPinned",
        "ShieldCheck",
        "Handshake",
        "Headphones",
      ],
    },
    {
      name: "displayOrder",
      label: "Display order",
      type: "number",
      min: 0,
    },
    {
      name: "active",
      label: "Visible on website",
      type: "checkbox",
    },
  ],

  testimonial: [
    {
      name: "guestName",
      label: "Guest name",
      type: "text",
      required: true,
    },
    {
      name: "guestLocation",
      label: "Guest location",
      type: "text",
      required: true,
    },
    {
      name: "comment",
      label: "Comment",
      type: "textarea",
      required: true,
    },
    {
      name: "rating",
      label: "Rating",
      type: "number",
      min: 1,
      max: 5,
      required: true,
    },
    {
      name: "initials",
      label: "Guest initials",
      type: "text",
    },
    {
      name: "guestImage",
      label: "Guest image",
      type: "image",
      folder: "testimonials",
    },
    {
      name: "displayOrder",
      label: "Display order",
      type: "number",
      min: 0,
    },
    {
      name: "active",
      label: "Visible on website",
      type: "checkbox",
    },
  ],
};

function ClientEditorModal({
  editor,
  saving,
  uploading,
  errorMessage,
  onClose,
  onSave,
  onUpload,
}) {
  const [formData, setFormData] = useState({});

  const fields =
    fieldConfigurations[editor.type] || [];

  useEffect(() => {
    const initialData = {};

    fields.forEach((field) => {
      if (field.type === "checkbox") {
        initialData[field.name] =
          editor.item?.[field.name] ?? true;
      } else if (field.type === "number") {
        initialData[field.name] =
          editor.item?.[field.name] ?? field.min ?? 0;
      } else if (field.type === "select") {
        initialData[field.name] =
          editor.item?.[field.name] ??
          field.options?.[0] ??
          "";
      } else {
        initialData[field.name] =
          editor.item?.[field.name] ?? "";
      }
    });

    setFormData(initialData);
  }, [editor]);

  const handleChange = (event) => {
    const { name, type, value, checked } =
      event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleImageUpload = async (
    event,
    field
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const uploadedImage = await onUpload(
      file,
      field.folder
    );

    if (uploadedImage) {
      setFormData((previousData) => ({
        ...previousData,
        [field.name]: uploadedImage.url,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="client-editor-overlay"
      onClick={saving ? undefined : onClose}
    >
      <form
        className="client-editor-modal"
        onSubmit={handleSubmit}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <header className="client-editor-header">
          <div>
            <p>
              {editor.mode === "add"
                ? "ADD CONTENT"
                : "EDIT CONTENT"}
            </p>

            <h2>
              {editor.mode === "add"
                ? `Add ${editor.type}`
                : `Edit ${editor.type}`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close editor"
          >
            <X size={21} />
          </button>
        </header>

        <div className="client-editor-body">
          {errorMessage && (
            <div className="client-editor-error">
              {errorMessage}
            </div>
          )}

          {fields.map((field) => {
            if (field.type === "textarea") {
              return (
                <label
                  className="client-editor-field"
                  key={field.name}
                >
                  {field.label}

                  <textarea
                    name={field.name}
                    rows="4"
                    value={
                      formData[field.name] ?? ""
                    }
                    onChange={handleChange}
                    required={field.required}
                    disabled={saving}
                  />
                </label>
              );
            }

            if (field.type === "checkbox") {
              return (
                <label
                  className="client-editor-checkbox"
                  key={field.name}
                >
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={Boolean(
                      formData[field.name]
                    )}
                    onChange={handleChange}
                    disabled={saving}
                  />

                  <span>{field.label}</span>
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label
                  className="client-editor-field"
                  key={field.name}
                >
                  {field.label}

                  <select
                    name={field.name}
                    value={
                      formData[field.name] ?? ""
                    }
                    onChange={handleChange}
                    disabled={saving}
                    required={field.required}
                  >
                    {field.options.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </label>
              );
            }

            if (field.type === "image") {
              return (
                <div
                  className="client-editor-field"
                  key={field.name}
                >
                  <label>{field.label}</label>

                  {formData[field.name] ? (
                    <img
                      className="client-editor-preview"
                      src={formData[field.name]}
                      alt="Uploaded preview"
                    />
                  ) : (
                    <div className="client-editor-no-image">
                        <Image size={27} />
                        <span>No image selected</span>
                    </div>
                  )}

                  <input
                    type="url"
                    name={field.name}
                    placeholder="Image URL"
                    value={
                      formData[field.name] ?? ""
                    }
                    onChange={handleChange}
                    disabled={saving || uploading}
                  />

                  <label className="client-upload-button">
                    <Upload size={17} />

                    {uploading
                      ? "Uploading..."
                      : "Upload image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        handleImageUpload(
                          event,
                          field
                        )
                      }
                      disabled={saving || uploading}
                    />
                  </label>
                </div>
              );
            }

            return (
              <label
                className="client-editor-field"
                key={field.name}
              >
                {field.label}

                <input
                  type={field.type}
                  name={field.name}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={
                    formData[field.name] ?? ""
                  }
                  onChange={handleChange}
                  required={field.required}
                  disabled={saving}
                />
              </label>
            );
          })}
        </div>

        <footer className="client-editor-footer">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="client-editor-save"
            disabled={saving || uploading}
          >
            {saving ? (
              <LoaderCircle
                className="client-spin"
                size={18}
              />
            ) : (
              <Save size={18} />
            )}

            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}

export default ClientEditorModal;