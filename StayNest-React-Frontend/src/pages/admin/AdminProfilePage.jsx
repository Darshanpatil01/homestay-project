import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  changeAdminPassword,
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminProfileService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/adminProfilePage.css";

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

function AdminProfilePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("PROFILE");

  const [profileData, setProfileData] =
    useState(initialProfileData);

  const [passwordData, setPasswordData] =
    useState(initialPasswordData);

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState("");

  const [profileError, setProfileError] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setProfileError("");

      const profile = await getAdminProfile();

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
          "Unable to load the administrator profile."
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

  const handleProfileSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      setProfileError("");
      setProfileMessage("");

      const response =
        await updateAdminProfile(
          profileData
        );

      setProfileData({
        fullName:
          response.fullName ||
          profileData.fullName,

        email:
          response.email ||
          profileData.email,

        phone:
          response.phone ||
          profileData.phone,

        city:
          response.city ||
          profileData.city,

        state:
          response.state ||
          profileData.state,
      });

      setProfileMessage(
        "Administrator profile updated successfully."
      );
    } catch (error) {
      setProfileError(
        getApiErrorMessage(
          error,
          "Unable to update the administrator profile."
        )
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event
  ) => {
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

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      setPasswordError(
        "New password must be different from the current password."
      );

      return;
    }

    try {
      setSavingPassword(true);

      await changeAdminPassword({
        currentPassword:
          passwordData.currentPassword,

        newPassword:
          passwordData.newPassword,
      });

      setPasswordData(initialPasswordData);

      setPasswordMessage(
        "Administrator password changed successfully."
      );
    } catch (error) {
      setPasswordError(
        getApiErrorMessage(
          error,
          "Unable to change the administrator password."
        )
      );
    } finally {
      setSavingPassword(false);
    }
  };

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
    <main className="admin-profile-page">
      <AdminProfileSidebar
        onLogout={handleLogout}
      />

      <section className="admin-profile-content">
        <header className="admin-profile-header">
          <div>
            <p>ADMINISTRATOR ACCOUNT</p>
            <h1>Admin profile</h1>

            <span>
              Manage your administrator information
              and account security.
            </span>
          </div>

          <div className="admin-profile-badge">
            <ShieldCheck size={21} />

            <span>
              <strong>Administrator</strong>
              Full system access
            </span>
          </div>
        </header>

        <section className="admin-profile-layout">
          <aside className="admin-profile-card">
            <div className="admin-profile-avatar">
              <ShieldCheck size={43} />
            </div>

            <h2>
              {profileData.fullName ||
                "Administrator"}
            </h2>

            <p>
              {profileData.email ||
                "Admin account"}
            </p>

            <span className="admin-profile-role">
              ADMIN
            </span>

            <nav>
              <button
                type="button"
                className={
                  activeTab === "PROFILE"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("PROFILE")
                }
              >
                <UserCog size={18} />
                Profile information
              </button>

              <button
                type="button"
                className={
                  activeTab === "PASSWORD"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("PASSWORD")
                }
              >
                <Lock size={18} />
                Change password
              </button>
            </nav>
          </aside>

          <div className="admin-profile-panel">
            {loading ? (
              <div className="admin-profile-loading">
                <LoaderCircle size={42} />
                <p>Loading profile...</p>
              </div>
            ) : activeTab === "PROFILE" ? (
              <>
                <div className="admin-profile-panel-heading">
                  <h2>Profile information</h2>

                  <p>
                    Update the information connected
                    to your administrator account.
                  </p>
                </div>

                {profileMessage && (
                  <div className="admin-profile-message success">
                    <CheckCircle size={19} />
                    {profileMessage}
                  </div>
                )}

                {profileError && (
                  <div className="admin-profile-message error">
                    <AlertCircle size={19} />
                    {profileError}
                  </div>
                )}

                <form
                  className="admin-profile-form"
                  onSubmit={
                    handleProfileSubmit
                  }
                >
                  <div className="admin-profile-form-group">
                    <label htmlFor="adminFullName">
                      <UserCog size={17} />
                      Full name
                    </label>

                    <input
                      id="adminFullName"
                      type="text"
                      name="fullName"
                      value={
                        profileData.fullName
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter administrator name"
                      required
                    />
                  </div>

                  <div className="admin-profile-form-group">
                    <label htmlFor="adminEmail">
                      <Mail size={17} />
                      Email address
                    </label>

                    <input
                      id="adminEmail"
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="admin-profile-form-group">
                    <label htmlFor="adminPhone">
                      <Phone size={17} />
                      Phone number
                    </label>

                    <input
                      id="adminPhone"
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="admin-profile-form-row">
                    <div className="admin-profile-form-group">
                      <label htmlFor="adminCity">
                        <MapPin size={17} />
                        City
                      </label>

                      <input
                        id="adminCity"
                        type="text"
                        name="city"
                        value={
                          profileData.city
                        }
                        onChange={
                          handleProfileChange
                        }
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="admin-profile-form-group">
                      <label htmlFor="adminState">
                        State
                      </label>

                      <input
                        id="adminState"
                        type="text"
                        name="state"
                        value={
                          profileData.state
                        }
                        onChange={
                          handleProfileChange
                        }
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="admin-profile-save"
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <LoaderCircle
                        className="admin-profile-spinning"
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
                <div className="admin-profile-panel-heading">
                  <h2>Change password</h2>

                  <p>
                    Choose a strong and secure
                    administrator password.
                  </p>
                </div>

                {passwordMessage && (
                  <div className="admin-profile-message success">
                    <CheckCircle size={19} />
                    {passwordMessage}
                  </div>
                )}

                {passwordError && (
                  <div className="admin-profile-message error">
                    <AlertCircle size={19} />
                    {passwordError}
                  </div>
                )}

                <form
                  className="admin-profile-form"
                  onSubmit={
                    handlePasswordSubmit
                  }
                >
                  <AdminPasswordField
                    id="adminCurrentPassword"
                    label="Current password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    visible={
                      showCurrentPassword
                    }
                    onToggle={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    onChange={
                      handlePasswordChange
                    }
                  />

                  <AdminPasswordField
                    id="adminNewPassword"
                    label="New password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    visible={showNewPassword}
                    onToggle={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    onChange={
                      handlePasswordChange
                    }
                  />

                  <AdminPasswordField
                    id="adminConfirmPassword"
                    label="Confirm new password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    visible={
                      showConfirmPassword
                    }
                    onToggle={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    onChange={
                      handlePasswordChange
                    }
                  />

                  <button
                    type="submit"
                    className="admin-profile-save"
                    disabled={savingPassword}
                  >
                    {savingPassword ? (
                      <LoaderCircle
                        className="admin-profile-spinning"
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
      </section>
    </main>
  );
}

function AdminPasswordField({
  id,
  label,
  name,
  value,
  visible,
  onToggle,
  onChange,
}) {
  return (
    <div className="admin-profile-form-group">
      <label htmlFor={id}>
        <Lock size={17} />
        {label}
      </label>

      <div className="admin-password-field">
        <input
          id={id}
          type={
            visible ? "text" : "password"
          }
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
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
}

function AdminProfileSidebar({
  onLogout,
}) {
  return (
    <aside className="admin-profile-sidebar">
      <Link
        to="/admin/dashboard"
        className="admin-profile-logo"
      >
        <span>Stay</span>Nest
        <small>ADMIN</small>
      </Link>

      <nav className="admin-profile-navigation">
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
        className="admin-profile-logout"
        onClick={onLogout}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

export default AdminProfilePage;