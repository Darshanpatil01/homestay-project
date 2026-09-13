import { useState } from "react";
import {
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { changeMyPassword } from "../../services/userService";
import { isAuthenticated } from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/changePasswordPage.css";
import "../../styles/pageApiState.css";
import "../../styles/authApiFeedback.css";

function ChangePasswordPage() {
  const [showPasswords, setShowPasswords] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setErrorMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    if (
      formData.currentPassword ===
      formData.newPassword
    ) {
      setErrorMessage(
        "New password must be different from the current password."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await changeMyPassword(formData);

      setSuccessMessage(
        "Your password has been changed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to change your password."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <KeyRound size={47} />
          <h1>Sign in required</h1>

          <p>
            Sign in before changing your account
            password.
          </p>

          <Link to="/">Return to homepage</Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="change-password-page">
        <section className="change-password-card">
          <div className="change-password-icon">
            <KeyRound size={29} />
          </div>

          <p className="section-small-title">
            ACCOUNT SECURITY
          </p>

          <h1>Change password</h1>

          <p className="change-password-description">
            Enter your current password and create a
            secure new password.
          </p>

          {errorMessage && (
            <div className="auth-api-error">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="auth-api-success">
              <CheckCircle size={18} />
              {successMessage}
            </div>
          )}

          <form
            className="change-password-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="currentPassword">
              Current password

              <input
                id="currentPassword"
                type={
                  showPasswords
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </label>

            <label htmlFor="newPassword">
              New password

              <input
                id="newPassword"
                type={
                  showPasswords
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                minLength="6"
                disabled={loading}
                required
              />
            </label>

            <label htmlFor="confirmPassword">
              Confirm new password

              <input
                id="confirmPassword"
                type={
                  showPasswords
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="6"
                disabled={loading}
                required
              />
            </label>

            <button
              type="button"
              className="show-passwords-button"
              onClick={() =>
                setShowPasswords(!showPasswords)
              }
            >
              {showPasswords ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

              {showPasswords
                ? "Hide passwords"
                : "Show passwords"}
            </button>

            <button
              type="submit"
              className="change-password-submit"
              disabled={loading}
            >
              {loading
                ? "Changing password..."
                : "Change password"}
            </button>
          </form>

          <Link
            to="/profile"
            className="back-to-profile"
          >
            Return to profile
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ChangePasswordPage;