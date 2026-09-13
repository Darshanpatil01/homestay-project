import {
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";

import "../../styles/footer.css";

const defaultFooterData = {
  websiteName: "StayNest",
  description:
    "Discover handpicked homestays, local experiences and welcoming hosts across India.",
  email: "support@staynest.in",
  phone: "+91 98765 43210",
  address: "Mumbai, Maharashtra, India",
  navigationLinks: [],
};

function Footer({
  footerData = defaultFooterData,
}) {
  const currentYear = new Date().getFullYear();

  const currentFooterData = {
    ...defaultFooterData,
    ...footerData,
  };

  const highlightedName =
    currentFooterData.websiteName.slice(0, 4);

  const remainingName =
    currentFooterData.websiteName.slice(4);

  const exploreLinks =
    currentFooterData.navigationLinks.length > 0
      ? currentFooterData.navigationLinks
      : [
          {
            id: 1,
            label: "Homestays",
            path: "/homestays",
          },
          {
            id: 2,
            label: "Destinations",
            path: "/destinations",
          },
          {
            id: 3,
            label: "Experiences",
            path: "/experiences",
          },
          {
            id: 4,
            label: "About us",
            path: "/about",
          },
        ];

  return (
    <footer className="website-footer">
      <div className="footer-container">
        <div className="footer-about">
          <Link to="/" className="footer-logo">
            <span>{highlightedName}</span>
            {remainingName}
          </Link>

          <p>{currentFooterData.description}</p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <Camera size={19} />
            </a>

            <a href="#" aria-label="Facebook">
              <MessageCircle size={19} />
            </a>

            <a href="#" aria-label="YouTube">
              <Play size={20} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>

          {exploreLinks
            .filter((link) => link.active !== false)
            .slice(0, 6)
            .map((link) => (
              <Link
                to={link.path}
                key={link.id || link.path}
              >
                {link.label}
              </Link>
            ))}
        </div>

        <div className="footer-column">
          <h3>Guests</h3>

          <Link to="/register">
            Create account
          </Link>

          <Link to="/bookings">
            My bookings
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/profile">
            My profile
          </Link>
        </div>

        <div className="footer-column">
          <h3>Management</h3>

          <Link to="/client/login">
            Client portal
          </Link>

          <Link to="/admin">
            Admin portal
          </Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>
            <MapPin size={18} />
            {currentFooterData.address}
          </p>

          <p>
            <Phone size={17} />
            {currentFooterData.phone}
          </p>

          <p>
            <Mail size={17} />
            {currentFooterData.email}
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear}{" "}
          {currentFooterData.websiteName}. All
          rights reserved.
        </p>

        <div>
          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;