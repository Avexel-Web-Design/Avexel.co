import React, { useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import Monogram from "./Monogram";
import PixelCard from "./PixelCard";
import AnimatedOrb from "./AnimatedOrb";
import { useForm, ValidationError } from '@formspree/react';

const ContactInfo = ({ icon, title, content }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
      <i
        className={`fas ${icon} text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
      ></i>
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {content}
      </p>
    </div>
  </div>
);

const AnimatedFormInput = ({ type = "text", name, placeholder, required = false, rows = null }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
  };

  const Component = rows ? 'textarea' : 'input';
  
  return (
    <div className="relative group">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Input field */}
      <Component
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        className={`relative w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
          isFocused 
            ? 'border-primary-500 bg-white/10 shadow-lg shadow-primary-500/20' 
            : 'border-white/10 hover:border-white/20'
        }`}
      />
      
      {/* Animated border overlay */}
      <div className={`absolute inset-0 rounded-lg border-2 border-primary-500/50 transition-opacity duration-300 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg opacity-20 blur"></div>
      </div>
      
      {/* Floating particles on focus */}
      {isFocused && (
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-primary-400 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

const Contact = () => {
  useScrollReveal();
  const [showCopied, setShowCopied] = useState(false);
  
  // Use Formspree's useForm hook with your form ID
  const [state, handleSubmit] = useForm("xvgkwonw");
  
  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = "contact@avexel.co";
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
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/6 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/4 left-1/5 w-48 h-48 border border-white/5 animate-spin-slow-reverse"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/6 left-1/8 opacity-15">
        <AnimatedOrb size="sm" hue={210} hoverIntensity={0.1} />
      </div>
      <div className="absolute bottom-1/5 right-1/6 opacity-20">
        <AnimatedOrb size="md" hue={270} hoverIntensity={0.15} />
      </div>
      <div className="absolute top-2/3 left-1/3 opacity-10">
        <AnimatedOrb size="xs" hue={240} hoverIntensity={0.05} />
      </div>

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
              Decided you want to work with us to empower your business? We are thrilled to work with you, and are ready to build something wonderful together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 reveal">
            <PixelCard className="p-8 h-full transition-all duration-500 hover:translate-y-[-4px]">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Why Work With Us
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3 group">
                  <i className="fas fa-check-circle text-primary-400 mt-1 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="group-hover:text-white transition-colors duration-300">
                    We offer professional services for a fraction of the cost, all the while being real people in your community not some far off corporate monolith.
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <i className="fas fa-check-circle text-primary-400 mt-1 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Building a website shouldn't be a hassle to you. We're students, we have time to be flexible and work around your schedule to do what's best for you.
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <i className="fas fa-check-circle text-primary-400 mt-1 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Throughout the whole process, you won't be speaking with just a representative. Our team is small and personal, so you'll be working directly with the person whos building your website.
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <i className="fas fa-check-circle text-primary-400 mt-1 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Ongoing support to ensure your website continues to serve
                    your needs
                  </span>
                </li>
              </ul>
            </PixelCard>

            <PixelCard className="p-8 h-full transition-all duration-500 hover:translate-y-[-4px]">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Let's Connect
              </h3>
              <p className="text-gray-300 mb-6">
                Have questions or ready to start? Drop us a message, and we'll
                get back to you within 24 hours. We can't wait to hear from you!
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:contact@avexel.co"
                  onClick={handleEmailClick}
                  className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors relative"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-envelope text-primary-400 group-hover:scale-110 transition-transform duration-300"></i>
                  </div>
                  <span className="group-hover:text-primary-300 transition-colors duration-300">contact@avexel.co</span>
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
                  className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-phone text-primary-400 group-hover:scale-110 transition-transform duration-300"></i>
                  </div>
                  <span className="group-hover:text-primary-300 transition-colors duration-300">(231)-373-8360</span>
                </a>
              </div>
            </PixelCard>
          </div>

          <PixelCard className="reveal transition-all duration-500 hover:translate-y-[-2px]">
            <form
              className="p-8"
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
                  <AnimatedFormInput
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                  <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <AnimatedFormInput
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
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
                <AnimatedFormInput
                  name="message"
                  placeholder="Tell us about your project..."
                  rows={4}
                  required
                />
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30"
                >
                  {/* Enhanced gradient overlay */}
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                    <span className="absolute inset-0 translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent group-hover:animate-shimmer"></span>
                  </span>
                  
                  <span className="relative flex items-center gap-2">
                    {state.submitting && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {state.submitting ? "Sending..." : "Send Message"}
                  </span>
                </button>
              </div>
              
              {state.succeeded && (
                <div className="mt-6 p-4 rounded-lg bg-green-500/20 text-green-200 text-center animate-fade-in">
                  <i className="fas fa-check-circle text-green-400 mr-2"></i>
                  Thank you for your message! We will get back to you soon.
                </div>
              )}
              
              <ValidationError 
                errors={state.errors}
                className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-200"
              />
            </form>
          </PixelCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;
