import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import Monogram from './Monogram';

const ContactInfo = ({ icon, title, content }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-all duration-300">
      <i className={`fas ${icon} text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}></i>
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{content}</p>
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

  return (
    <section id="contact" className="py-32 bg-black relative overflow-hidden scroll-mt-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-1/6 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/4 left-1/5 w-48 h-48 border border-white/5 animate-spin-slow-reverse"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal stagger-reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">Get In Touch</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <p className="text-lg text-gray-300">
            Have a website project idea? Want to support our FRC team? We'd love to hear from you!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto reveal">
          {/* Contact Information */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full glass-morphism p-8 lg:p-12 rounded-xl">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Contact Info
                </h3>
                
                <ContactInfo
                  icon="fa-envelope"
                  title="Email Us"
                  content="contact@avexel.co"
                />
                
                <ContactInfo
                  icon="fa-map-marker-alt"
                  title="School"
                  content="Harbor Springs High School, Michigan"
                />
                
                <ContactInfo
                  icon="fa-clock"
                  title="Response Time"
                  content="We'll respond after school hours, usually within 24 hours"
                />
                
                {/* Team Members */}
                <div className="pt-8 space-y-4">
                  <p className="text-white font-medium mb-4">Our Student Team:</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex items-center gap-3">
                      <Monogram name="Ryan Latimer" size="xs" />
                      <div>
                        <p className="text-sm font-medium text-white">Ryan Latimer</p>
                        <p className="text-xs text-gray-400">Student Developer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Monogram name="Gavin Moceri" size="xs" />
                      <div>
                        <p className="text-sm font-medium text-white">Gavin Moceri</p>
                        <p className="text-xs text-gray-400">Student Developer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Monogram name="Conner Breckenfeld" size="xs" />
                      <div>
                        <p className="text-sm font-medium text-white">Conner Breckenfeld</p>
                        <p className="text-xs text-gray-400">Student Designer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative glass-morphism p-8 lg:p-12 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Send a Message
              </h3>
              
              <form action="https://formsubmit.co/contact@avexel.co" method="POST" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FormInput
                      name="name"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <FormInput
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <FormInput
                    name="subject"
                    placeholder="Subject"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Your Message"
                    required
                    className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 placeholder-gray-500 resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-gray-400 mb-4">
                    All messages will be read by our student team members. We'll respond as soon as we can.
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative inline-flex w-full items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white font-semibold overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                    <span className="relative flex items-center gap-2">
                      Send Message
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                        <path d="M13 5L20 12M20 12L13 19M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;