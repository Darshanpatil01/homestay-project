import { useState } from "react";
import {
  Eye,
  EyeOff,
  Home,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginClient } from "../../services/authService";
import { saveAuthenticatedAccount } from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/authApiFeedback.css";

function ClientLoginPage() {
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
      const authResponse = await loginClient({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      saveAuthenticatedAccount(authResponse);

      window.dispatchEvent(
        new CustomEvent("staynest:auth-changed")
      );

      navigate("/client/dashboard", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to sign in to the Client portal."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="portal-login-page client-portal">
      <section className="portal-login-introduction">
        <Link to="/" className="portal-login-logo">
          <span>Stay</span>Nest
        </Link>

        <div>
          <p>CLIENT PORTAL</p>

          <h1>Manage your homestay website.</h1>

          <span>
            Update website content, properties,
            destinations and customer bookings.
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
            <Home size={28} />
          </div>

          <p className="portal-small-title">
            SECURE CLIENT ACCESS
          </p>

          <h2>Client sign in</h2>

          <span className="portal-login-description">
            Enter the Client account credentials.
          </span>

          {errorMessage && (
            <div
              className="auth-api-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <label htmlFor="clientEmail">
            Email address

            <input
              id="clientEmail"
              type="email"
              name="email"
              placeholder="client@staynest.in"
              value={loginData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </label>

          <label htmlFor="clientPassword">
            Password

            <div className="portal-password-input">
              <input
                id="clientPassword"
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
              : "Open Client Portal"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ClientLoginPage;