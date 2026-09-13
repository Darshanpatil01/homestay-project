import { useState } from "react";
import {
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/authService";
import { saveAuthenticatedAccount } from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/authApiFeedback.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const authResponse = await loginAdmin({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      saveAuthenticatedAccount(authResponse);

      window.dispatchEvent(
        new CustomEvent("staynest:auth-changed")
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to sign in to the Admin portal."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="portal-login-page admin-portal">
      <section className="portal-login-introduction">
        <Link to="/" className="portal-login-logo">
          <span>Stay</span>Nest
        </Link>

        <div>
          <p>ADMINISTRATION</p>

          <h1>Control and monitor the platform.</h1>

          <span>
            Manage users, properties, bookings and
            website activity securely.
          </span>
        </div>

        <Link to="/" className="portal-back-link">
          Return to website
        </Link>
      </section>

      <section className="portal-login-form-section">
        <form
          className="portal-login-form"
          onSubmit={handleSubmit}
        >
          <div className="portal-login-icon">
            <ShieldCheck size={28} />
          </div>

          <p className="portal-small-title">
            RESTRICTED ACCESS
          </p>

          <h2>Administrator sign in</h2>

          <span className="portal-login-description">
            Only authorized administrators can
            continue.
          </span>

          {errorMessage && (
            <div
              className="auth-api-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <label htmlFor="adminEmail">
            Email address

            <input
              id="adminEmail"
              type="email"
              name="email"
              placeholder="admin@staynest.in"
              value={loginData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </label>

          <label htmlFor="adminPassword">
            Password

            <div className="portal-password-input">
              <input
                id="adminPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
                aria-label="Show or hide password"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="portal-submit-button"
            disabled={loading}
          >
            <ShieldCheck size={18} />

            {loading
              ? "Signing in..."
              : "Open Admin Portal"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;