import { useEffect, useState } from "react";
import {
  ListPlus,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  createNavigationLink,
  deleteNavigationLink,
  updateNavigationLink,
} from "../../services/clientContentService.js";

import { getApiErrorMessage } from "../../utils/apiError.js";

import "../../styles/clientNavigationManager.css";

const emptyNavigationLink = {
  label: "",
  path: "",
  displayOrder: 0,
  active: true,
};

function ClientNavigationManager({
  navigationLinks = [],
  onLinksChange = () => {},
}) {
  const [managerOpen, setManagerOpen] =
    useState(false);

  const [editor, setEditor] = useState(null);
  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [formData, setFormData] = useState(
    emptyNavigationLink
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    if (!editor) {
      return;
    }

    setFormData({
      label: editor.item?.label || "",
      path: editor.item?.path || "",
      displayOrder:
        editor.item?.displayOrder ?? 0,
      active: editor.item?.active ?? true,
    });
  }, [editor]);

  const sortedLinks = [...navigationLinks].sort(
    (first, second) =>
      Number(first.displayOrder) -
      Number(second.displayOrder)
  );

  const openAddForm = () => {
    setErrorMessage("");

    setEditor({
      mode: "add",
      item: null,
    });
  };

  const openEditForm = (link) => {
    setErrorMessage("");

    setEditor({
      mode: "edit",
      item: link,
    });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));

    setErrorMessage("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");

    try {
      const payload = {
        label: formData.label.trim(),
        path: normalizePath(
          formData.path.trim()
        ),
        displayOrder: Number(
          formData.displayOrder
        ),
        active: Boolean(formData.active),
      };

      let savedLink;

      if (editor.mode === "add") {
        savedLink =
          await createNavigationLink(payload);

        onLinksChange([
          ...navigationLinks,
          savedLink,
        ]);
      } else {
        savedLink =
          await updateNavigationLink(
            editor.item.id,
            payload
          );

        onLinksChange(
          navigationLinks.map((link) =>
            link.id === savedLink.id
              ? savedLink
              : link
          )
        );
      }

      setEditor(null);
      setFormData(emptyNavigationLink);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to save the navigation link."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      await deleteNavigationLink(
        deleteTarget.id
      );

      onLinksChange(
        navigationLinks.filter(
          (link) =>
            link.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to delete the navigation link."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="navigation-manager-open"
        onClick={() => {
          setManagerOpen(true);
          setErrorMessage("");
        }}
        title="Manage navigation links"
        aria-label="Manage navigation links"
      >
        <ListPlus size={18} />
      </button>

      {managerOpen && (
        <div
          className="navigation-manager-overlay"
          onClick={() =>
            !saving && setManagerOpen(false)
          }
        >
          <section
            className="navigation-manager-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <header>
              <div>
                <p>NAVBAR CONTENT</p>
                <h2>Navigation links</h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setManagerOpen(false)
                }
                disabled={saving}
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </header>

            <div className="navigation-manager-body">
              {errorMessage && (
                <div className="navigation-manager-error">
                  {errorMessage}
                </div>
              )}

              <button
                type="button"
                className="navigation-add-link"
                onClick={openAddForm}
              >
                <Plus size={18} />
                Add navigation link
              </button>

              <div className="navigation-links-list">
                {sortedLinks.map((link) => (
                  <article

                    className={
                      link.active === false
                        ? "inactive"
                        : ""
                    }
                    key={link.id}
                  >
                    <div>
                      <strong>
                        {link.label}
                      </strong>

                      <span>{link.path}</span>

                      {link.active === false && (
                        <small>Hidden</small>
                      )}
                    </div>

                    <span className="navigation-order">
                      {link.displayOrder}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(link)
                      }
                      title="Edit link"
                      aria-label={`Edit ${link.label}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="navigation-delete"
                      onClick={() =>
                        setDeleteTarget(link)
                      }
                      title="Delete link"
                      aria-label={`Delete ${link.label}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {editor && (
        <div className="navigation-manager-overlay">
          <form
            className="navigation-link-form"
            onSubmit={handleSave}
          >
            <header>
              <div>
                <p>
                  {editor.mode === "add"
                    ? "ADD LINK"
                    : "EDIT LINK"}
                </p>

                <h2>Navigation link</h2>
              </div>

              <button
                type="button"
                onClick={() => setEditor(null)}
                disabled={saving}
              >
                <X size={21} />
              </button>
            </header>

            <div className="navigation-link-form-body">
              {errorMessage && (
                <div className="navigation-manager-error">
                  {errorMessage}
                </div>
              )}

              <label>
                Link label

                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="Gallery"
                  required
                />
              </label>

              <label>
                Link path

                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  placeholder="/gallery"
                  required
                />
              </label>

              <label>
                Display order

                <input
                  type="number"
                  name="displayOrder"
                  min="0"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="navigation-active-field">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                Visible on website
              </label>
            </div>

            <footer>
              <button
                type="button"
                onClick={() => setEditor(null)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="navigation-save"
                disabled={saving}
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save link"}
              </button>
            </footer>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="navigation-manager-overlay">
          <div className="navigation-delete-dialog">
            <Trash2 size={29} />

            <h2>Delete navigation link?</h2>

            <p>
              “{deleteTarget.label}” will be removed
              from the website navigation.
            </p>

            {errorMessage && (
              <div className="navigation-manager-error">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="navigation-confirm-delete"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function normalizePath(path) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return path.startsWith("/")
    ? path
    : `/${path}`;
}

export default ClientNavigationManager;