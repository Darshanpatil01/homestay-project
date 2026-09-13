import { useState } from "react";
import {
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/heroSection.css";

const defaultHeroData = {
  smallTitle:
    "HANDPICKED HOMESTAYS ACROSS INDIA",
  title: "Stay somewhere",
  highlightedText: "worth remembering.",
  description:
    "Thoughtful homes, generous hosts and unforgettable experiences.",
  image:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
};

function HeroSection({
  heroData = defaultHeroData,
  clientMode = false,
  onEdit = () => {},
}) {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const currentHeroData = {
    ...defaultHeroData,
    ...heroData,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSearchData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const searchParameters =
      new URLSearchParams();

    if (searchData.destination.trim()) {
      searchParameters.set(
        "search",
        searchData.destination.trim()
      );
    }

    if (searchData.checkIn) {
      searchParameters.set(
        "checkIn",
        searchData.checkIn
      );
    }

    if (searchData.checkOut) {
      searchParameters.set(
        "checkOut",
        searchData.checkOut
      );
    }

    searchParameters.set(
      "guests",
      searchData.guests
    );

    navigate(
      `/homestays?${searchParameters.toString()}`
    );
  };

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(9, 32, 25, 0.5),
            rgba(9, 32, 25, 0.64)
          ),
          url("${currentHeroData.image}")
        `,
      }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-small-title">
          {currentHeroData.smallTitle}
        </p>

        <h1>
          {currentHeroData.title}

          <span>
            {currentHeroData.highlightedText}
          </span>
        </h1>

        <p className="hero-description">
          {currentHeroData.description}
        </p>
      </div>

      <form
        className="hero-search"
        onSubmit={handleSearch}
      >
        <div className="search-field destination-field">
          <label htmlFor="destination">
            WHERE
          </label>

          <div className="search-input">
            <MapPin size={18} />

            <input
              id="destination"
              type="text"
              name="destination"
              placeholder="Search destination"
              value={searchData.destination}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="search-field">
          <label htmlFor="checkIn">
            CHECK IN
          </label>

          <input
            id="checkIn"
            type="date"
            name="checkIn"
            value={searchData.checkIn}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <label htmlFor="checkOut">
            CHECK OUT
          </label>

          <input
            id="checkOut"
            type="date"
            name="checkOut"
            value={searchData.checkOut}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <label htmlFor="guests">
            GUESTS
          </label>

          <div className="search-input">
            <Users size={18} />

            <input
              id="guests"
              type="number"
              name="guests"
              min="1"
              max="20"
              value={searchData.guests}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          className="search-button"
          type="submit"
        >
          <Search size={20} />
          Search
        </button>
      </form>
    </section>
  );
}

export default HeroSection;