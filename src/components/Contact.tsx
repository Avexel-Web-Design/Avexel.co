import React, { useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import AnimatedOrb from "./AnimatedOrb"; // Keeping for now if needed, or remove if unused
import { useForm, ValidationError } from '@formspree/react';

const ContactInfo = ({ icon, title, content }: { icon: string, title: string, content: React.ReactNode }) => (
  <div className="flex items-start gap-6 group p-4 rounded-xl hover:bg-white/5 transition-colors duration-300">
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-neon-purple/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/50">
      <i
        className={`fas ${icon} text-2xl bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
      ></i>
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors duration-300 font-outfit">{title}</h3>
      <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {content}
      </div>
    </div>
  </div>
);

const AnimatedFormInput = ({ type = "text", name, placeholder, required = false, rows = undefined }: { type?: string, name: string, placeholder: string, required?: boolean, rows?: number }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
  };

  const Component = rows ? 'textarea' : 'input';

  return (
    <div className="relative group">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 rounded-xl blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Input field */}
      {rows ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={`relative w-full px-6 py-4 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${isFocused
            ? 'border-neon-purple bg-black/80 shadow-lg shadow-neon-purple/10'
            : 'border-white/10 hover:border-white/20'
            }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={`relative w-full px-6 py-4 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${isFocused
            ? 'border-neon-purple bg-black/80 shadow-lg shadow-neon-purple/10'
            : 'border-white/10 hover:border-white/20'
            }`}
        />
      )}

      {/* Floating particles on focus */}
      {isFocused && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-blue rounded-full animate-ping"></div>
      )}
    </div>
  );
};

const Contact = () => {
  useScrollReveal();
  const [showCopied, setShowCopied] = useState(false);

  // Use Formspree's useForm hook with your form ID
  const [state, handleSubmit] = useForm("xvgkwonw");

  const handleEmailClick = (e: React.MouseEvent) => {
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
      className="py-32 bg-[#050505] relative overflow-hidden snap-start"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] animate-pulse-glow delay-1000 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="inline-block text-sm font-bold text-neon-purple tracking-[0.2em] uppercase mb-4 animate-float">
              Get In Touch
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-outfit">
              Let's Build Something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                Amazing Together
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Ready to start your project? We're here to help you transform your digital presence.
            </p>
          </div>

          <div className="grid lg:grid-cols-1 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="reveal">
              <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-neon-purple/10 to-transparent opacity-50 blur-2xl -mr-20 -mt-20 pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-400 mb-2 ml-1">Name</label>
                      <AnimatedFormInput type="text" name="name" placeholder="Your Name" required />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-2 ml-1" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-2 ml-1">Email</label>
                      <AnimatedFormInput type="email" name="email" placeholder="your@email.com" required />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-2 ml-1" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-400 mb-2 ml-1">Message</label>
                    <AnimatedFormInput name="message" placeholder="Tell us about your project..." rows={5} required />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs mt-2 ml-1" />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {state.submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <i className="fas fa-spinner fa-spin"></i> Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>

                  {state.succeeded && (
                    <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 text-neon-green text-center animate-fade-in">
                      <i className="fas fa-check-circle mr-2"></i>
                      Message sent successfully! We'll be in touch soon.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
