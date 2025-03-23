import React, { useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import Monogram from "./Monogram";

const ContactInfo = ({ icon, title, content }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-all duration-300">
      <i
        className={`fas ${icon} text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}
      ></i>
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {content}
      </p>
    </div>
  </div>
);

const FormInput = ({ type = "text", name, placeholder, required = false }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    required={required}
    className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 placeholder-gray-500"
  />
);

const Contact = () => {
  useScrollReveal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, let's just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Thank you for your message! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = "contact@avexel.com";
    navigator.clipboard.writeText(email).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000); // Hide after 2 seconds
    });
  };

  return (
    <section
      id="contact"
      className="py-32 bg-black relative overflow-hidden scroll-mt-24"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-1/6 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/4 left-1/5 w-48 h-48 border border-white/5 animate-spin-slow-reverse"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Let's Build Something Amazing
            </h2>
            <p className="text-lg text-gray-300">
              Ready to elevate your online presence with a local Harbor Springs team? We're here to help turn
              your vision into reality while supporting STEM education in Northern Michigan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Why Work With Us
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-primary-400 mt-1"></i>
                  <span>
                    Professional web development with a purpose – supporting
                    STEM, innovation, and creation.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-primary-400 mt-1"></i>
                  <span>
                    Flexible scheduling so that getting a website made is no
                    hassle nor drag on your business.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-primary-400 mt-1"></i>
                  <span>
                    Direct communication with our development team throughout
                    the project
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-primary-400 mt-1"></i>
                  <span>
                    Ongoing support to ensure your website continues to serve
                    your needs
                  </span>
                </li>
              </ul>
            </div>

            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Let's Connect
              </h3>
              <p className="text-gray-300 mb-6">
                Have questions or ready to start? Drop us a message, and we'll
                get back to you within 24 hours. Our Harbor Springs student team is excited to learn about
                your project!
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:contact@avexel.com"
                  onClick={handleEmailClick}
                  className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors relative"
                >
                  <i className="fas fa-envelope text-primary-400"></i>
                  <span>contact@avexel.com</span>
                  <span
                    className={`absolute -top-8 left-0 px-2 py-1 text-sm bg-primary-500 text-white rounded-md transition-opacity duration-200 ${
                      showCopied ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Email copied!
                  </span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <i className="fas fa-phone text-primary-400"></i>
                  <span>(231)-373-8360</span>
                </a>
              </div>
            </div>
          </div>

          <form
            className="glass-morphism p-8 rounded-xl border border-white/5 reveal"
            onSubmit={handleSubmit}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Tell us about your project..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
