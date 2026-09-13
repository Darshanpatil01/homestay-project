import {
  ArrowLeft,
  Home,
  Search,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "../../styles/notFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="not-found-page">
        <section className="not-found-content">
          <div className="not-found-icon">
            <Search size={42} />
          </div>

          <p className="not-found-number">404</p>

          <h1>We couldn&apos;t find that page</h1>

          <p className="not-found-description">
            The page may have been moved, deleted or
            the address may have been entered
            incorrectly.
          </p>

          <div className="not-found-actions">
            <Link to="/">
              <Home size={18} />
              Return to homepage
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Go back
            </button>
          </div>

          <div className="not-found-suggestions">
            <p>You may be looking for:</p>

            <div>
              <Link to="/homestays">
                Homestays
              </Link>

              <Link to="/destinations">
                Destinations
              </Link>

              <Link to="/experiences">
                Experiences
              </Link>

              <Link to="/contact">
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default NotFoundPage;