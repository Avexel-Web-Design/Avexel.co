// src/components/Contact.jsx
import React from 'react';

const ContactInfo = ({ icon, title, content }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10">
      <i className={`fas ${icon} text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}></i>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400">{content}</p>
    </div>
  </div>
);

const FormInput = ({ type = "text", name, placeholder, required = false }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    required={required}
    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 placeholder-gray-500"
  />
);

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-dark scroll-mt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-400">
            Ready to start your next project? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto reveal">
          {/* Contact Information */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full bg-dark backdrop-blur-sm p-8 lg:p-12 rounded-xl border border-white/5">
              <div className="space-y-8">
                <ContactInfo
                  icon="fa-envelope"
                  title="Email Us"
                  content="contact@avexel.co"
                />
                <ContactInfo
                  icon="fa-map-marker-alt"
                  title="Location"
                  content="Michigan, United States"
                />
                <ContactInfo
                  icon="fa-clock"
                  title="Working Hours"
                  content="Monday - Friday, 9AM - 5PM EST"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-dark backdrop-blur-sm p-8 lg:p-12 rounded-xl border border-white/5">
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
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 placeholder-gray-500 resize-none"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Send Message
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