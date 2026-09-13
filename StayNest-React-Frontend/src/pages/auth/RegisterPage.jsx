import { useState } from "react";
import {
  CheckCircle,
  Eye,
  EyeOff,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { registerUser } from "../../services/authService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/registerPage.css";
import "../../styles/authApiFeedback.css";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

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

    setErrorMessage("");
    setSuccessMessage("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setErrorMessage(
        "Password and confirm password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword:
          formData.confirmPassword,
      });

      setSuccessMessage(
        "Your account has been created successfully. You can now sign in."
      );

      setFormData(initialFormData);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to create your account."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="register-page">
        <section className="register-introduction">
          <div className="register-introduction-content">
            <p className="register-small-title">
              JOIN THE STAYNEST COMMUNITY
            </p>

            <h1>
              Travel differently.
              <span>Stay meaningfully.</span>
            </h1>

            <p>
              Create your traveller account to
              discover memorable homestays across
              India.
            </p>

            <div className="registration-information">
              <div>
                <UserRound size={24} />

                <div>
                  <h3>Traveller account</h3>

                  <p>
                    Browse, save and book your
                    favourite homestays.
                  </p>
                </div>
              </div>

              <div>
                <CheckCircle size={24} />

                <div>
                  <h3>One simple account</h3>

                  <p>
                    Manage your profile, wishlist and
                    bookings from one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="register-form-section">
          <div className="register-form-container">
            <p className="section-small-title">
              CREATE ACCOUNT
            </p>

            <h2>Register with StayNest</h2>

            <p className="register-form-description">
              Enter your details to create a traveller
              account.
            </p>

            {errorMessage && (
              <div
                className="auth-api-error"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                className="auth-api-success"
                role="status"
              >
                <CheckCircle size={19} />
                {successMessage}
              </div>
            )}

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >
              <div className="register-form-group">
                <label htmlFor="fullName">
                  Full name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="registerEmail">
                    Email address
                  </label>

                  <input
                    id="registerEmail"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="phone">
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="registerPassword">
                    Password
                  </label>

                  <div className="register-password-input">
                    <input
                      id="registerPassword"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      minLength="6"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      disabled={loading}
                      aria-label="Show or hide password"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    minLength="6"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  disabled={loading}
                  required
                />

                <span>
                  I agree to the Terms and Conditions
                  and Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                className="register-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="already-registered">
              Already registered?
              <Link to="/"> Sign in from homepage</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default RegisterPage;