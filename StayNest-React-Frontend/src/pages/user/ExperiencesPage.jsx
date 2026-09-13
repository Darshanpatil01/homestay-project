import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { getPublicExperiences } from "../../services/experienceService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/experiencesPage.css";
import "../../styles/pageApiState.css";

function ExperiencesPage() {
  const [experiences, setExperiences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadExperiences = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getPublicExperiences();

      setExperiences(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load experiences."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <div className="page-api-loader" />
          <h1>Loading experiences</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <Navbar />

        <main className="page-api-state">
          <RefreshCw size={42} />
          <h1>Unable to load experiences</h1>
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={loadExperiences}
          >
            Try again
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="all-experiences-page">
        <section className="experiences-page-banner">
          <p className="section-small-title">
            MORE THAN A STAY
          </p>

          <h1>
            Experiences worth travelling for
          </h1>

          <span>
            Discover local food, culture, nature and
            memorable activities during your stay.
          </span>
        </section>

        <section className="experiences-page-content">
          {experiences.length > 0 ? (
            <div className="all-experiences-grid">
              {experiences.map(
                (experience, index) => (
                  <article
                    className={`all-experience-card ${
                      index % 2 !== 0
                        ? "reverse"
                        : ""
                    }`}
                    key={experience.id}
                  >
                    <div className="all-experience-image">
                      <img
                        src={experience.image}
                        alt={experience.title}
                      />
                    </div>

                    <div className="all-experience-content">
                      <p>
                        EXPERIENCE{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <h2>
                        {experience.title}
                      </h2>

                      <span>
                        {experience.description}
                      </span>

                      <a
                        href="#contact"
                        aria-label={`Enquire about ${experience.title}`}
                      >
                        Enquire about experience
                        <ArrowUpRight size={19} />
                      </a>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="page-api-empty">
              <h2>No experiences available</h2>
              <p>
                New experiences will be added soon.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ExperiencesPage;