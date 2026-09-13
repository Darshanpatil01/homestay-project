import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import HeroSection from "../../components/user/HeroSection";
import PopularDestinations from "../../components/user/PopularDestinations";
import FeaturedHomestays from "../../components/user/FeaturedHomestays";
import StayCategories from "../../components/user/StayCategories";
import ExperiencesSection from "../../components/user/ExperiencesSection";
import WhyChooseUs from "../../components/user/WhyChooseUs";
import TestimonialsSection from "../../components/user/TestimonialsSection";

import { getHomepageData } from "../../services/homeService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/homePage.css";

function HomePage() {
  const [homepageData, setHomepageData] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const loadHomepage = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getHomepageData();
      setHomepageData(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the homepage."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepage();
  }, []);

  if (loading) {
    return (
      <main className="homepage-state">
        <div className="homepage-loader" />

        <h1>Loading StayNest</h1>

        <p>
          Preparing homestays and destinations for
          you.
        </p>
      </main>
    );
  }

  if (errorMessage || !homepageData) {
    return (
      <main className="homepage-state">
        <RefreshCw size={42} />

        <h1>Unable to load the website</h1>

        <p>{errorMessage}</p>

        <button
          type="button"
          onClick={loadHomepage}
        >
          Try again
        </button>
      </main>
    );
  }

  const { settings } = homepageData;

  const navbarData = {
    websiteName: settings.websiteName,
    signInLabel: settings.signInLabel,
    clientButtonLabel:
      settings.clientButtonLabel,
    navigationLinks:
      settings.navigationLinks || [],
  };

  const heroData = {
    smallTitle: settings.heroSmallTitle,
    title: settings.heroTitle,
    highlightedText:
      settings.heroHighlightedText,
    description: settings.heroDescription,
    image: settings.heroImage,
  };

  const footerData = {
    websiteName: settings.websiteName,
    description: settings.footerDescription,
    email: settings.contactEmail,
    phone: settings.contactPhone,
    address: settings.contactAddress,
    navigationLinks:
      settings.navigationLinks || [],
  };

  return (
    <>
      <Navbar navbarData={navbarData} />

      <main>
        <HeroSection heroData={heroData} />

        <PopularDestinations
          destinations={homepageData.destinations}
        />

        <FeaturedHomestays
          homestays={homepageData.homestays}
        />

        <StayCategories
          categories={homepageData.categories}
        />

        <ExperiencesSection
          experiences={homepageData.experiences}
        />

        <WhyChooseUs
          benefits={homepageData.benefits}
        />

        <TestimonialsSection
          testimonials={homepageData.testimonials}
        />
      </main>

      <Footer footerData={footerData} />
    </>
  );
}

export default HomePage;