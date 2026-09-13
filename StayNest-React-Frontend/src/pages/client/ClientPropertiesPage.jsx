import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Calendar,
  Eye,
  Home,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import ClientEditorModal from "../../components/client/ClientEditorModal";

import {
  createHomestay,
  deleteHomestay,
  updateHomestay,
  uploadClientImage,
} from "../../services/clientContentService";

import {
  getClientDashboardData,
} from "../../services/clientDashboardService";

import {
  removeAuthenticatedAccount,
} from "../../utils/authStorage";

import {
  getApiErrorMessage,
} from "../../utils/apiError";

import "../../styles/clientDashboardPage.css";
import "../../styles/clientPropertiesPage.css";
import "../../styles/clientEditorModal.css";
import "../../styles/pageApiState.css";

function ClientPropertiesPage() {
  const navigate = useNavigate();

  const [homestays, setHomestays] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [editor, setEditor] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadHomestays = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getClientDashboardData();

      setHomestays(response.homestays);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load properties."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomestays();
  }, []);

  const filteredHomestays = useMemo(() => {
    const searchValue = searchText
      .trim()
      .toLowerCase();

    return homestays.filter((homestay) => {
      const matchesSearch =
        !searchValue ||
        homestay.name
          .toLowerCase()
          .includes(searchValue) ||
        homestay.location
          .toLowerCase()
          .includes(searchValue) ||
        homestay.category
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        homestay.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    homestays,
    searchText,
    statusFilter,
  ]);

  const showSuccess = (message) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const openAddEditor = () => {
    setErrorMessage("");

    setEditor({
      type: "homestay",
      mode: "add",
      item: null,
    });
  };

  const openEditEditor = (homestay) => {
    setErrorMessage("");

    setEditor({
      type: "homestay",
      mode: "edit",
      item: homestay,
    });
  };

  const handleUpload = async (
    file,
    folder
  ) => {
    setUploading(true);
    setErrorMessage("");

    try {
      return await uploadClientImage(
        file,
        folder
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to upload the property image."
        )
      );

      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setErrorMessage("");

    try {
      let savedHomestay;

      if (editor.mode === "add") {
        savedHomestay =
          await createHomestay(formData);

        setHomestays(
          (previousHomestays) => [
            ...previousHomestays,
            savedHomestay,
          ]
        );
      } else {
        savedHomestay =
          await updateHomestay(
            editor.item.id,
            formData
          );

        setHomestays(
          (previousHomestays) =>
            previousHomestays.map(
              (homestay) =>
                homestay.id ===
                savedHomestay.id
                  ? savedHomestay
                  : homestay
            )
        );
      }

      setEditor(null);

      showSuccess(
        editor.mode === "add"
          ? "Property added successfully."
          : "Property updated successfully."
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to save the property."
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
      await deleteHomestay(
        deleteTarget.id
      );

      setHomestays(
        (previousHomestays) =>
          previousHomestays.filter(
            (homestay) =>
              homestay.id !==
              deleteTarget.id
          )
      );

      setDeleteTarget(null);

      showSuccess(
        "Property deleted successfully."
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to delete the property. It may have existing bookings."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    removeAuthenticatedAccount();

    navigate("/client/login", {
      replace: true,
    });
  };

  return (
    <main className="client-dashboard-page">
      <aside className="client-dashboard-sidebar">
        <Link
          to="/client/dashboard"
          className="client-dashboard-logo"
        >
          <span>Stay</span>Nest
        </Link>

        <nav className="client-dashboard-navigation">
          <Link to="/client/dashboard">
            <Home size={19} />
            Dashboard
          </Link>

          <Link to="/client">
            <Pencil size={19} />
            Website editor
          </Link>

          <Link
            to="/client/properties"
            className="active"
          >
            <Home size={19} />
            Properties
          </Link>

          <Link to="/client/bookings">
            <Calendar size={19} />
            Bookings
          </Link>

          <Link to="/client/profile">
            <User size={19} />
            Business profile
          </Link>

          <Link to="/">
            <Eye size={19} />
            View website
          </Link>
        </nav>

        <button
          type="button"
          className="client-dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <section className="client-dashboard-content">
        <header className="client-dashboard-header">
          <div>
            <p>PROPERTY MANAGEMENT</p>
            <h1>Properties</h1>

            <span>
              Add and manage homestays displayed on
              the website.
            </span>
          </div>

          <button
            type="button"
            className="client-add-property"
            onClick={openAddEditor}
          >
            <Plus size={18} />
            Add property
          </button>
        </header>

        {successMessage && (
          <div className="client-properties-success">
            {successMessage}
          </div>
        )}

        <section className="client-properties-filters">
          <div className="client-property-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search property, location or category"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="ALL">
              All statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="HIDDEN">
              Hidden
            </option>

            <option value="UNAVAILABLE">
              Unavailable
            </option>
          </select>
        </section>

        {loading && (
          <div className="client-properties-state">
            <div className="page-api-loader" />
            <h2>Loading properties</h2>
          </div>
        )}

        {!loading && errorMessage && !editor && !deleteTarget && (
          <div className="client-properties-error">
            <RefreshCw size={18} />
            {errorMessage}

            <button
              type="button"
              onClick={loadHomestays}
            >
              Retry
            </button>
          </div>
        )}

        {!loading &&
          filteredHomestays.length > 0 && (
            <section className="client-properties-grid">
              {filteredHomestays.map(
                (homestay) => (
                  <article
                    className="client-property-card"
                    key={homestay.id}
                  >
                    <div className="client-property-image">
                      <img
                        src={homestay.image}
                        alt={homestay.name}
                      />

                      <span
                        className={`client-property-status ${homestay.status.toLowerCase()}`}
                      >
                        {homestay.status}
                      </span>

                      {homestay.featured && (
                        <span className="client-property-featured">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="client-property-content">
                      <p>
                        {homestay.location}
                      </p>

                      <h2>{homestay.name}</h2>

                      <span>
                        {homestay.category ||
                          "Uncategorized"}
                      </span>

                      <div className="client-property-information">
                        <span>
                          {homestay.guests} guests
                        </span>

                        <span>
                          {homestay.bedrooms} bedrooms
                        </span>

                        <strong>
                          ₹
                          {Number(
                            homestay.pricePerNight
                          ).toLocaleString(
                            "en-IN"
                          )}
                          <small> / night</small>
                        </strong>
                      </div>

                      <div className="client-property-actions">
                        <Link
                          to={`/homestays/${homestay.id}`}
                          target="_blank"
                          title="View property"
                        >
                          <Eye size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            openEditEditor(
                              homestay
                            )
                          }
                          title="Edit property"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            setErrorMessage("");
                            setDeleteTarget(
                              homestay
                            );
                          }}
                          title="Delete property"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </section>
          )}

        {!loading &&
          !errorMessage &&
          filteredHomestays.length === 0 && (
            <div className="client-properties-state">
              <Home size={42} />

              <h2>No properties found</h2>

              <p>
                Add a new property or change your
                search filters.
              </p>

              <button
                type="button"
                onClick={openAddEditor}
              >
                <Plus size={18} />
                Add property
              </button>
            </div>
          )}
      </section>

      {editor && (
        <ClientEditorModal
          editor={editor}
          saving={saving}
          uploading={uploading}
          errorMessage={errorMessage}
          onClose={() => {
            if (!saving && !uploading) {
              setEditor(null);
              setErrorMessage("");
            }
          }}
          onSave={handleSave}
          onUpload={handleUpload}
        />
      )}

      {deleteTarget && (
        <div className="client-editor-overlay">
          <div className="client-delete-dialog">
            <Trash2 size={30} />

            <h2>Delete property?</h2>

            <p>
              “{deleteTarget.name}” will be
              permanently removed.
            </p>

            {errorMessage && (
              <div className="client-editor-error">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setErrorMessage("");
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete"
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
    </main>
  );
}

export default ClientPropertiesPage;