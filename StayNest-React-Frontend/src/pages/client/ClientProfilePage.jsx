import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  changeClientPassword,
  getClientProfile,
  updateClientProfile,
} from "../../services/clientProfileService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/clientProfilePage.css";

const initialProfileData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
};

const initialPasswordData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function ClientProfilePage() {
  const [profileData, setProfileData] =
    useState(initialProfileData);

  const [passwordData, setPasswordData] =
    useState(initialPasswordData);

  const [activeTab, setActiveTab] = useState("PROFILE");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    loadClientProfile();
  }, []);

  const loadClientProfile = async () => {
    try {
      setLoading(true);
      setProfileError("");

      const profile = await getClientProfile();

      setProfileData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        state: profile.state || "",
      });
    } catch (error) {
      setProfileError(
        getApiErrorMessage(
          error,
          "Unable to load your business profile."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      setProfileMessage("");
      setProfileError("");

      const updatedProfile =
        await updateClientProfile(profileData);

      setProfileData({
        fullName:
          updatedProfile.fullName || profileData.fullName,
        email: updatedProfile.email || profileData.email,
        phone: updatedProfile.phone || profileData.phone,
        city: updatedProfile.city || profileData.city,
        state: updatedProfile.state || profileData.state,
      });

      setProfileMessage(
        "Business profile updated successfully."
      );
    } catch (error) {
      setProfileError(
        getApiErrorMessage(
          error,
          "Unable to update your business profile."
        )
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    try {
      setSavingPassword(true);

      await changeClientPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData(initialPasswordData);

      setPasswordMessage(
        "Password changed successfully."
      );
    } catch (error) {
      setPasswordError(
        getApiErrorMessage(
          error,
          "Unable to change your password."
        )
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <main className="client-profile-page">
      <header className="client-profile-header">
        <div>
          <Link
            to="/client/dashboard"
            className="client-profile-back"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <p>CLIENT PORTAL</p>
          <h1>Business profile</h1>

          <span>
            Manage your client account and security settings.
          </span>
        </div>
      </header>

      <section className="client-profile-content">
        <aside className="client-profile-sidebar">
          <div className="client-profile-avatar">
            <BriefcaseBusiness size={40} />
          </div>

          <h2>
            {profileData.fullName || "StayNest Client"}
          </h2>

          <p>{profileData.email || "Client account"}</p>

          <span className="client-account-role">
            CLIENT ACCOUNT
          </span>

          <nav>
            <button
              type="button"
              className={
                activeTab === "PROFILE" ? "active" : ""
              }
              onClick={() => setActiveTab("PROFILE")}
            >
              <UserRound size={18} />
              Profile information
            </button>

            <button
              type="button"
              className={
                activeTab === "PASSWORD" ? "active" : ""
              }
              onClick={() => setActiveTab("PASSWORD")}
            >
              <Lock size={18} />
              Change password
            </button>
          </nav>

          <Link
            to="/client"
            className="client-profile-editor-link"
          >
            Open website editor
          </Link>
        </aside>

        <div className="client-profile-panel">
          {loading ? (
            <div className="client-profile-loading">
              <LoaderCircle size={35} />
              <p>Loading your profile...</p>
            </div>
          ) : activeTab === "PROFILE" ? (
            <>
              <div className="client-profile-panel-heading">
                <h2>Profile information</h2>

                <p>
                  Update the information connected to your
                  client account.
                </p>
              </div>

              {profileMessage && (
                <div className="client-profile-message success">
                  <CheckCircle size={19} />
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <div className="client-profile-message error">
                  <AlertCircle size={19} />
                  {profileError}
                </div>
              )}

              <form
                className="client-profile-form"
                onSubmit={handleProfileSubmit}
              >
                <div className="client-profile-form-group">
                  <label htmlFor="clientFullName">
                    <UserRound size={17} />
                    Client or business name
                  </label>

                  <input
                    id="clientFullName"
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter client or business name"
                    required
                  />
                </div>

                <div className="client-profile-form-group">
                  <label htmlFor="clientEmail">
                    <Mail size={17} />
                    Email address
                  </label>

                  <input
                    id="clientEmail"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="client-profile-form-group">
                  <label htmlFor="clientPhone">
                    <Phone size={17} />
                    Phone number
                  </label>

                  <input
                    id="clientPhone"
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="client-profile-form-row">
                  <div className="client-profile-form-group">
                    <label htmlFor="clientCity">
                      <MapPin size={17} />
                      City
                    </label>

                    <input
                      id="clientCity"
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="client-profile-form-group">
                    <label htmlFor="clientState">
                      State
                    </label>

                    <input
                      id="clientState"
                      type="text"
                      name="state"
                      value={profileData.state}
                      onChange={handleProfileChange}
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="client-profile-save-button"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <LoaderCircle
                      className="client-profile-spinner"
                      size={18}
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  {savingProfile
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="client-profile-panel-heading">
                <h2>Change password</h2>

                <p>
                  Use a strong password to protect the client
                  portal.
                </p>
              </div>

              {passwordMessage && (
                <div className="client-profile-message success">
                  <CheckCircle size={19} />
                  {passwordMessage}
                </div>
              )}

              {passwordError && (
                <div className="client-profile-message error">
                  <AlertCircle size={19} />
                  {passwordError}
                </div>
              )}

              <form
                className="client-profile-form"
                onSubmit={handlePasswordSubmit}
              >
                <PasswordField
                  id="clientCurrentPassword"
                  label="Current password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  showPassword={showCurrentPassword}
                  onToggle={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  onChange={handlePasswordChange}
                />

                <PasswordField
                  id="clientNewPassword"
                  label="New password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  showPassword={showNewPassword}
                  onToggle={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  onChange={handlePasswordChange}
                />

                <PasswordField
                  id="clientConfirmPassword"
                  label="Confirm new password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  showPassword={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  onChange={handlePasswordChange}
                />

                <button
                  type="submit"
                  className="client-profile-save-button"
                  disabled={savingPassword}
                >
                  {savingPassword ? (
                    <LoaderCircle
                      className="client-profile-spinner"
                      size={18}
                    />
                  ) : (
                    <Lock size={18} />
                  )}

                  {savingPassword
                    ? "Changing password..."
                    : "Change password"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function PasswordField({
  id,
  label,
  name,
  value,
  showPassword,
  onToggle,
  onChange,
}) {
  return (
    <div className="client-profile-form-group">
      <label htmlFor={id}>
        <Lock size={17} />
        {label}
      </label>

      <div className="client-profile-password-field">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          minLength="6"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ClientProfilePage;