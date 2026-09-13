import { useEffect, useState } from "react";
import {
  CalendarDays,
  Heart,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import {
  getMyProfile,
  updateMyProfile,
} from "../../services/userService";

import {
  getLoggedInUser,
  isAuthenticated,
  saveAuthenticatedAccount,
  getAuthenticatedAccount,
} from "../../utils/authStorage";

import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/profilePage.css";
import "../../styles/pageApiState.css";
import "../../styles/authApiFeedback.css";

function ProfilePage() {
  const [profileData, setProfileData] =
    useState({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      profileImage: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loggedInUser = getLoggedInUser();

  const loadProfile = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getMyProfile();

      setProfileData({
        fullName: response.fullName || "",
        email: response.email || "",
        phone: response.phone || "",
        address: response.address || "",
        city: response.city || "",
        state: response.state || "",
        postalCode: response.postalCode || "",
        profileImage: response.profileImage || "",
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load your profile."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfileData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedProfile =
        await updateMyProfile({
          fullName: profileData.fullName.trim(),
          phone: profileData.phone.trim(),
          address: profileData.address.trim(),
          city: profileData.city.trim(),
          state: profileData.state.trim(),
          postalCode:
            profileData.postalCode.trim(),
          profileImage:
            profileData.profileImage.trim(),
        });

      setProfileData({
        fullName: updatedProfile.fullName || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
        city: updatedProfile.city || "",
        state: updatedProfile.state || "",
        postalCode:
          updatedProfile.postalCode || "",
        profileImage:
          updatedProfile.profileImage || "",
      });

      const currentAuthentication =
        getAuthenticatedAccount();

      if (currentAuthentication) {
        saveAuthenticatedAccount({
          ...currentAuthentication,
          user: updatedProfile,
        });

        window.dispatchEvent(
          new CustomEvent(
            "staynest:auth-changed"
          )
        );
      }

      setSuccessMessage(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to update your profile."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <UserRound size={47} />

          <h1>Sign in to view your profile</h1>

          <p>
            Use the Sign In button on the homepage
            before accessing your account.
          </p>

          <Link to="/">Return to homepage</Link>
        </main>

        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading your profile</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <section className="profile-header">
          <div>
            <p className="section-small-title">
              YOUR ACCOUNT
            </p>

            <h1>My profile</h1>

            <p>
              Manage your personal information and
              account details.
            </p>
          </div>
        </section>

        <section className="profile-content">
          <aside className="profile-sidebar">
            {profileData.profileImage ? (
              <img
                className="profile-avatar-image"
                src={profileData.profileImage}
                alt={profileData.fullName}
              />
            ) : (
              <div className="profile-avatar">
                <UserRound size={42} />
              </div>
            )}

            <h2>{profileData.fullName}</h2>
            <p>{profileData.email}</p>

            <span className="profile-role">
              {loggedInUser?.role || "USER"}
            </span>

            <nav className="profile-navigation">
              <Link
                to="/profile"
                className="active"
              >
                <UserRound size={18} />
                Profile information
              </Link>

              <Link to="/bookings">
                <CalendarDays size={18} />
                My bookings
              </Link>

              <Link to="/wishlist">
                <Heart size={18} />
                My wishlist
              </Link>

              <Link to="/change-password">
                Change password
              </Link>
            </nav>
          </aside>

          <div className="profile-form-container">
            <div className="profile-form-heading">
              <h2>Personal information</h2>

              <p>
                Update your contact and location
                details.
              </p>
            </div>

            {errorMessage && (
              <div className="auth-api-error">
                <RefreshCw size={18} />
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="auth-api-success">
                {successMessage}
              </div>
            )}

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >
              <div className="profile-form-group">
                <label htmlFor="profileFullName">
                  <UserRound size={17} />
                  Full name
                </label>

                <input
                  id="profileFullName"
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="profileEmail">
                  <Mail size={17} />
                  Email address
                </label>

                <input
                  id="profileEmail"
                  type="email"
                  value={profileData.email}
                  readOnly
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="profilePhone">
                  <Phone size={17} />
                  Phone number
                </label>

                <input
                  id="profilePhone"
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="profileAddress">
                  <MapPin size={17} />
                  Address
                </label>

                <input
                  id="profileAddress"
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label htmlFor="profileCity">
                    City
                  </label>

                  <input
                    id="profileCity"
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="profileState">
                    State
                  </label>

                  <input
                    id="profileState"
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label htmlFor="postalCode">
                    Postal code
                  </label>

                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={
                      profileData.postalCode
                    }
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="profileImage">
                    Profile image URL
                  </label>

                  <input
                    id="profileImage"
                    type="url"
                    name="profileImage"
                    value={
                      profileData.profileImage
                    }
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProfilePage;