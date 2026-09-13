import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "../../styles/contactPage.css";

function ContactPage() {
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Contact form:", formData);

    setSuccessMessage(
      "Your message has been submitted successfully. We will contact you soon."
    );

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-banner">
          <p>CONTACT STAYNEST</p>
          <h1>How can we help you?</h1>

          <span>
            Contact our team for booking assistance, property registration or
            general questions.
          </span>
        </section>

        <section className="contact-content">
          <div className="contact-information">
            <p className="section-small-title">GET IN TOUCH</p>

            <h2>We would love to hear from you</h2>

            <p className="contact-description">
              Whether you are planning a stay or registering your property, our
              team is here to help.
            </p>

            <div className="contact-details">
              <article>
                <div className="contact-icon">
                  <MapPin size={23} />
                </div>

                <div>
                  <h3>Visit us</h3>
                  <p>Mumbai, Maharashtra, India</p>
                </div>
              </article>

              <article>
                <div className="contact-icon">
                  <Phone size={22} />
                </div>

                <div>
                  <h3>Call us</h3>
                  <p>+91 98765 43210</p>
                </div>
              </article>

              <article>
                <div className="contact-icon">
                  <Mail size={22} />
                </div>

                <div>
                  <h3>Email us</h3>
                  <p>support@staynest.in</p>
                </div>
              </article>

              <article>
                <div className="contact-icon">
                  <Clock size={22} />
                </div>

                <div>
                  <h3>Support hours</h3>
                  <p>Monday–Saturday, 9:00 AM–7:00 PM</p>
                </div>
              </article>
            </div>
          </div>

          <div className="contact-form-container">
            <p className="section-small-title">SEND A MESSAGE</p>
            <h2>Tell us what you need</h2>

            {successMessage && (
              <div className="contact-success-message">
                {successMessage}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="contactFullName">Full name</label>

                  <input
                    id="contactFullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contactEmail">Email address</label>

                  <input
                    id="contactEmail"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="contactPhone">Phone number</label>

                  <input
                    id="contactPhone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contactSubject">Subject</label>

                  <select
                    id="contactSubject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="BOOKING">Booking assistance</option>
                    <option value="HOST">Property registration</option>
                    <option value="ACCOUNT">Account support</option>
                    <option value="GENERAL">General question</option>
                  </select>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="contactMessage">Message</label>

                <textarea
                  id="contactMessage"
                  name="message"
                  rows="6"
                  placeholder="Write your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-button">
                Send message
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ContactPage;