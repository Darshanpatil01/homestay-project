import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BedDouble,
  CalendarDays,
  Eye,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  Star,
  UserCog,
  Users,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { getAdminHomestays } from "../../services/adminService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/adminPropertiesPage.css";

function AdminPropertiesPage() {
  const navigate = useNavigate();

  const [homestays, setHomestays] = useState([]);
  const [selectedHomestay, setSelectedHomestay] =
    useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadHomestays();
  }, []);

  const loadHomestays = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAdminHomestays();

      const homestayList = Array.isArray(response)
        ? response
        : response.content ||
          response.homestays ||
          response.properties ||
          response.data ||
          [];

      setHomestays(homestayList);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load homestays."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredHomestays = useMemo(() => {
    const searchValue = searchText
      .trim()
      .toLowerCase();

    return homestays.filter((homestay) => {
      const name =
        homestay.name ||
        homestay.title ||
        "";

      const location =
        homestay.location ||
        homestay.city ||
        "";

      const status = getHomestayStatus(homestay);

      const matchesSearch =
        !searchValue ||
        name.toLowerCase().includes(searchValue) ||
        location.toLowerCase().includes(searchValue);

      const matchesStatus =
        selectedStatus === "ALL" ||
        status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [
    homestays,
    searchText,
    selectedStatus,
  ]);

  const handleLogout = () => {
    localStorage.removeItem(
      "staynest-authenticated-account"
    );

    localStorage.removeItem(
      "staynest-access-token"
    );

    localStorage.removeItem(
      "staynest-refresh-token"
    );

    navigate("/admin", {
      replace: true,
    });
  };

  return (
    <main className="admin-properties-page">
      <AdminPropertiesSidebar
        onLogout={handleLogout}
      />

      <section className="admin-properties-content">
        <header className="admin-properties-header">
          <div>
            <p>PROPERTY MANAGEMENT</p>
            <h1>Homestays</h1>

            <span>
              Monitor every property displayed on the
              website.
            </span>
          </div>

          <button
            type="button"
            className="admin-properties-refresh"
            onClick={loadHomestays}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "admin-properties-spinning"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        {errorMessage && (
          <div className="admin-properties-error">
            <AlertCircle size={20} />

            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={loadHomestays}
            >
              Try again
            </button>
          </div>
        )}

        <section className="admin-properties-summary">
          <PropertySummary
            title="Total properties"
            value={homestays.length}
            color="total"
          />

          <PropertySummary
            title="Active"
            value={countByStatus(
              homestays,
              "ACTIVE"
            )}
            color="active"
          />

          <PropertySummary
            title="Hidden"
            value={countByStatus(
              homestays,
              "INACTIVE"
            )}
            color="inactive"
          />

          <PropertySummary
            title="Featured"
            value={
              homestays.filter(
                (homestay) =>
                  homestay.featured === true
              ).length
            }
            color="featured"
          />
        </section>

        <section className="admin-properties-panel">
          <div className="admin-properties-toolbar">
            <div className="admin-properties-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search property or location"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              aria-label="Filter properties by status"
            >
              <option value="ALL">
                All properties
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Hidden
              </option>
            </select>
          </div>

          {loading ? (
            <div className="admin-properties-loading">
              <LoaderCircle size={42} />
              <p>Loading homestays...</p>
            </div>
          ) : filteredHomestays.length > 0 ? (
            <div className="admin-properties-grid">
              {filteredHomestays.map(
                (homestay) => (
                  <PropertyCard
                    key={homestay.id}
                    homestay={homestay}
                    onView={() =>
                      setSelectedHomestay(
                        homestay
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="admin-properties-empty">
              <Home size={46} />

              <h2>No homestays found</h2>

              <p>
                Try changing your search or status
                filter.
              </p>
            </div>
          )}
        </section>
      </section>

      {selectedHomestay && (
        <PropertyDetailsModal
          homestay={selectedHomestay}
          onClose={() =>
            setSelectedHomestay(null)
          }
        />
      )}
    </main>
  );
}

function PropertyCard({
  homestay,
  onView,
}) {
  const name =
    homestay.name ||
    homestay.title ||
    "Unnamed homestay";

  const location =
    homestay.location ||
    homestay.city ||
    "Location unavailable";

  const price =
    homestay.pricePerNight ??
    homestay.price ??
    0;

  const status = getHomestayStatus(homestay);

  return (
    <article className="admin-property-card">
      <div className="admin-property-image">
        <img
          src={
            homestay.image ||
            homestay.imageUrl ||
            "https://placehold.co/900x650?text=Homestay"
          }
          alt={name}
        />

        <span
          className={`admin-property-status ${status.toLowerCase()}`}
        >
          {status === "ACTIVE"
            ? "Active"
            : "Hidden"}
        </span>

        {homestay.featured && (
          <span className="admin-property-featured">
            Featured
          </span>
        )}
      </div>

      <div className="admin-property-information">
        <p className="admin-property-location">
          <MapPin size={15} />
          {location}
        </p>

        <h2>{name}</h2>

        <div className="admin-property-features">
          <span>
            <Users size={17} />
            {homestay.guests ||
              homestay.maximumGuests ||
              0}{" "}
            guests
          </span>

          <span>
            <BedDouble size={18} />
            {homestay.bedrooms || 0} bedrooms
          </span>

          <span>
            <Star size={16} />
            {homestay.rating || "New"}
          </span>
        </div>

        <div className="admin-property-footer">
          <p>
            <strong>
              ₹{Number(price).toLocaleString("en-IN")}
            </strong>

            <span>/ night</span>
          </p>

          <div>
            <button
              type="button"
              onClick={onView}
              aria-label={`View ${name} details`}
              title="View details"
            >
              <Eye size={17} />
            </button>

            <Link
              to={`/homestays/${homestay.id}`}
              target="_blank"
              aria-label={`Open ${name} on website`}
              title="Open on website"
            >
              <Home size={17} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function PropertyDetailsModal({
  homestay,
  onClose,
}) {
  const name =
    homestay.name ||
    homestay.title ||
    "Unnamed homestay";

  const price =
    homestay.pricePerNight ??
    homestay.price ??
    0;

  const status = getHomestayStatus(homestay);

  return (
    <div
      className="admin-property-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-property-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="admin-property-modal-close"
          onClick={onClose}
          aria-label="Close property details"
        >
          <X size={21} />
        </button>

        <img
          className="admin-property-modal-image"
          src={
            homestay.image ||
            homestay.imageUrl ||
            "https://placehold.co/1000x600?text=Homestay"
          }
          alt={name}
        />

        <div className="admin-property-modal-content">
          <p className="admin-property-modal-label">
            PROPERTY DETAILS
          </p>

          <h2>{name}</h2>

          <p className="admin-property-modal-location">
            <MapPin size={16} />

            {homestay.location ||
              homestay.city ||
              "Location unavailable"}
          </p>

          <div className="admin-property-modal-badges">
            <span
              className={`admin-property-status ${status.toLowerCase()}`}
            >
              {status === "ACTIVE"
                ? "Active"
                : "Hidden"}
            </span>

            {homestay.featured && (
              <span className="admin-property-featured-inline">
                Featured
              </span>
            )}
          </div>

          <div className="admin-property-details-grid">
            <PropertyDetail
              label="Price per night"
              value={`₹${Number(
                price
              ).toLocaleString("en-IN")}`}
            />

            <PropertyDetail
              label="Maximum guests"
              value={
                homestay.guests ||
                homestay.maximumGuests ||
                0
              }
            />

            <PropertyDetail
              label="Bedrooms"
              value={homestay.bedrooms || 0}
            />

            <PropertyDetail
              label="Rating"
              value={
                homestay.rating || "Not rated"
              }
            />

            <PropertyDetail
              label="Category"
              value={
                homestay.categoryName ||
                homestay.category?.name ||
                "Not provided"
              }
            />

            <PropertyDetail
              label="Destination"
              value={
                homestay.destinationName ||
                homestay.destination?.name ||
                "Not provided"
              }
            />
          </div>

          <div className="admin-property-description">
            <h3>Description</h3>

            <p>
              {homestay.description ||
                "No description has been provided."}
            </p>
          </div>

          <Link
            to={`/homestays/${homestay.id}`}
            target="_blank"
            className="admin-open-property"
          >
            <Eye size={18} />
            Open property on website
          </Link>
        </div>
      </div>
    </div>
  );
}

function PropertyDetail({
  label,
  value,
}) {
  return (
    <div className="admin-property-detail">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function PropertySummary({
  title,
  value,
  color,
}) {
  return (
    <article
      className={`admin-property-summary-card ${color}`}
    >
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function AdminPropertiesSidebar({
  onLogout,
}) {
  return (
    <aside className="admin-properties-sidebar">
      <Link
        to="/admin/dashboard"
        className="admin-properties-logo"
      >
        <span>Stay</span>Nest
        <small>ADMIN</small>
      </Link>

      <nav className="admin-properties-navigation">
        <NavLink to="/admin/dashboard">
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users">
          <Users size={19} />
          Users
        </NavLink>

        <NavLink to="/admin/properties">
          <Home size={19} />
          Homestays
        </NavLink>

        <NavLink to="/admin/bookings">
          <CalendarDays size={19} />
          Bookings
        </NavLink>

        <NavLink to="/admin/profile">
          <UserCog size={19} />
          Admin profile
        </NavLink>

        <NavLink to="/">
          <Eye size={19} />
          View website
        </NavLink>
      </nav>

      <button
        type="button"
        className="admin-properties-logout"
        onClick={onLogout}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

function getHomestayStatus(homestay) {
  if (homestay.status) {
    return homestay.status;
  }

  if (
    homestay.active === false ||
    homestay.isActive === false
  ) {
    return "INACTIVE";
  }

  return "ACTIVE";
}

function countByStatus(
  homestays,
  status
) {
  return homestays.filter(
    (homestay) =>
      getHomestayStatus(homestay) === status
  ).length;
}

export default AdminPropertiesPage;