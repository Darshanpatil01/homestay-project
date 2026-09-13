import {
  BadgeCheck,
  HeartHandshake,
  Home,
  Leaf,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "../../styles/aboutPage.css";

function AboutPage() {
  const values = [
    {
      id: 1,
      title: "Authentic Hospitality",
      description:
        "We connect travellers with hosts who make every guest feel welcome.",
      icon: HeartHandshake,
    },
    {
      id: 2,
      title: "Verified Properties",
      description:
        "Every homestay is reviewed before it appears on our platform.",
      icon: BadgeCheck,
    },
    {
      id: 3,
      title: "Local Communities",
      description:
        "We help local property owners grow their hospitality businesses.",
      icon: Users,
    },
    {
      id: 4,
      title: "Responsible Travel",
      description:
        "We encourage meaningful travel that respects nature and communities.",
      icon: Leaf,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <div>
            <p>OUR STORY</p>

            <h1>
              Stays that feel personal,
              <span>journeys that feel meaningful.</span>
            </h1>
          </div>
        </section>

        <section className="about-introduction">
          <div className="about-introduction-heading">
            <p className="section-small-title">ABOUT STAYNEST</p>

            <h2>
              We believe where you stay should be part of the journey.
            </h2>
          </div>

          <div className="about-introduction-description">
            <p>
              StayNest is a homestay discovery platform that connects
              travellers with welcoming property owners across India.
            </p>

            <p>
              Our goal is to make it easier to discover comfortable homes,
              trusted hosts and authentic local experiences beyond ordinary
              hotel stays.
            </p>

            <p>
              From peaceful mountain cottages to private coastal villas, every
              property tells a different story.
            </p>
          </div>
        </section>

        <section className="about-story-section">
          <div className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1300&q=85"
              alt="Beautiful StayNest homestay"
            />
          </div>

          <div className="about-story-content">
            <p className="section-small-title">WHY WE STARTED</p>

            <h2>Making local hospitality easier to discover</h2>

            <p>
              Many beautiful properties and local hosts remain difficult for
              travellers to find. StayNest gives property owners a place to
              present their homes while helping travellers discover reliable,
              memorable stays.
            </p>

            <p>
              Property owners can register as clients and manage their
              properties after their account is reviewed and approved by an
              administrator.
            </p>

            <div className="about-statistics">
              <div>
                <strong>150+</strong>
                <span>Homestays</span>
              </div>

              <div>
                <strong>80+</strong>
                <span>Local hosts</span>
              </div>

              <div>
                <strong>18+</strong>
                <span>Destinations</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-values-heading">
            <p className="section-small-title">OUR VALUES</p>
            <h2>What guides StayNest</h2>
          </div>

          <div className="about-values-grid">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article className="about-value-card" key={value.id}>
                  <Icon size={30} strokeWidth={1.6} />

                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="about-host-section">
          <Home size={42} strokeWidth={1.5} />

          <div>
            <p className="section-small-title">HOST WITH STAYNEST</p>
            <h2>Have a beautiful property to share?</h2>

            <p>
              Register as a property owner and become part of our growing host
              community.
            </p>
          </div>

          <a href="/register?role=client">Become a host</a>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutPage;