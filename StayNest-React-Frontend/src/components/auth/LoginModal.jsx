import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { saveAuthenticatedAccount } from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/loginModal.css";
import "../../styles/authApiFeedback.css";

function LoginModal({ isOpen, onClose }) {
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

  if (!isOpen) {
    return null;
  }

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
      const authResponse = await loginUser({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      saveAuthenticatedAccount(authResponse);

      window.dispatchEvent(
        new CustomEvent("staynest:auth-changed")
      );

      setLoginData({
        email: "",
        password: "",
      });

      onClose();
      navigate("/profile");
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to sign in. Check your credentials."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-modal-overlay"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="login-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="login-modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close login popup"
        >
          <X size={23} />
        </button>

        <div className="login-modal-heading">
          <p className="section-small-title">
            WELCOME BACK
          </p>

          <h2>Sign in to StayNest</h2>

          <p>
            Sign in to manage your profile, bookings
            and saved homestays.
          </p>
        </div>

        {errorMessage && (
          <div className="auth-api-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-form-group">
            <label htmlFor="loginEmail">
              Email address
            </label>

            <input
              id="loginEmail"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-form-group">
            <div className="password-label-row">
              <label htmlFor="loginPassword">
                Password
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <div className="password-input-container">
              <input
                id="loginPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-visibility-button"
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
          </div>

          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-register-message">
          Don&apos;t have an account?

          <Link to="/register" onClick={onClose}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;