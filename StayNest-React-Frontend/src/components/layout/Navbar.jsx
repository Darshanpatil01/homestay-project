import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  LogOut,
  Menu,
  Pencil,
  UserRound,
  X,
} from "lucide-react";

import LoginModal from "../auth/LoginModal";

import "../../styles/navbar.css";
import "../../styles/navbarAuthControls.css";

const AUTH_STORAGE_KEY =
  "staynest-authenticated-account";

const defaultNavigationLinks = [
  { id: 1, label: "Home", path: "/" },
  {
    id: 2,
    label: "Homestays",
    path: "/homestays",
  },
  {
    id: 3,
    label: "Destinations",
    path: "/destinations",
  },
  {
    id: 4,
    label: "Experiences",
    path: "/experiences",
  },
  { id: 5, label: "About", path: "/about" },
  {
    id: 6,
    label: "Contact",
    path: "/contact",
  },
];

function getAuthenticatedUser() {
  try {
    const storedAccount = localStorage.getItem(
      AUTH_STORAGE_KEY
    );

    if (!storedAccount) {
      return null;
    }

    const account = JSON.parse(storedAccount);

    return account.role === "USER"
      ? account
      : null;
  } catch {
    return null;
  }
}

function Navbar({
  clientMode = false,
  onEdit = () => {},
  navbarData = {},
}) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [authenticatedUser, setAuthenticatedUser] =
    useState(getAuthenticatedUser);

  useEffect(() => {
    const updateAuthentication = () => {
      setAuthenticatedUser(
        getAuthenticatedUser()
      );
    };

    window.addEventListener(
      "storage",
      updateAuthentication
    );

    window.addEventListener(
      "staynest-auth-updated",
      updateAuthentication
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateAuthentication
      );

      window.removeEventListener(
        "staynest-auth-updated",
        updateAuthentication
      );
    };
  }, []);

  const websiteName =
    navbarData.websiteName || "StayNest";

  const navigationLinks =
    navbarData.navigationLinks?.length > 0
      ? navbarData.navigationLinks
      : defaultNavigationLinks;

  const signInLabel =
    navbarData.signInLabel || "Sign In";

  const highlightedName = websiteName.slice(0, 4);
  const remainingName = websiteName.slice(4);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setAuthenticatedUser(null);
    setMenuOpen(false);

    window.dispatchEvent(
      new Event("staynest-auth-updated")
    );

    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand-wrapper">
            <Link
              to="/"
              className="navbar-logo"
              onClick={closeMenu}
            >
              <span>{highlightedName}</span>
              {remainingName}
            </Link>

            {clientMode && (
              <button
                type="button"
                className="navbar-edit-button"
                onClick={onEdit}
                aria-label="Edit navbar"
                title="Edit navbar"
              >
                <Pencil size={15} />
              </button>
            )}
          </div>

          <nav
            className={
              menuOpen
                ? "navbar-menu active"
                : "navbar-menu"
            }
          >
            {navigationLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            {authenticatedUser ? (
              <div className="navbar-user-actions">
                <Link
                  to="/profile"
                  className="navbar-profile-link"
                  onClick={closeMenu}
                >
                  <UserRound size={18} />

                  <span>
                    {authenticatedUser.fullName
                      ?.trim()
                      .split(" ")[0] ||
                      "Profile"}
                  </span>
                </Link>

                <button
                  type="button"
                  className="navbar-logout-button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="login-button"
                  type="button"
                  onClick={() =>
                    setLoginOpen(true)
                  }
                >
                  <UserRound size={18} />
                  {signInLabel}
                </button>

                {!clientMode && (
                  <Link
                    to="/register"
                    className="host-button"
                    onClick={closeMenu}
                  >
                    Create Account
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            {menuOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>
      </header>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}

export default Navbar;