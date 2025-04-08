import React from "react";
import useCounterAnimation from "../hooks/useCounterAnimation";
import useScrollReveal from "../hooks/useScrollReveal";

const CapabilityCard = ({
  icon,
  title,
  description,
  target,
  suffix,
  startValue = 0,
}) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
        {/* Icon with animated background */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl animate-pulse-slow"></div>
          <div className="relative w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
            <i
              className={`fas ${icon} text-2xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}
            ></i>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>

          {/* Statistics with animated counter */}
          <div className="pt-6">
            <div className="flex items-center justify-center gap-1">
              <span
                className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent counter"
                data-target={target}
              >
                {startValue}
              </span>
              <span className="text-xl text-primary-400">{suffix}</span>
            </div>
            <div className="w-full h-1 mt-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Capabilities = () => {
  useScrollReveal();
  useCounterAnimation();

  return (
    <section
      id="capabilities"
      className="py-20 bg-black relative overflow-hidden scroll-mt-16"
    >
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-1/5 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/4 left-1/6 w-48 h-48 border border-white/5 animate-spin-slow-reverse"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">
              What We Do Best
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Our Technical Expertise
            </h2>
            <p className="text-lg text-gray-300">
              From responsive design to seamless functionality, we bring
              together the best modern web technologies to create exceptional
              digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Frontend Development
              </h3>
              <p className="text-gray-400 mb-6">
                We craft beautiful, responsive interfaces that work flawlessly
                across all devices. Our websites don't just look good – they
                provide an intuitive experience that keeps users coming back.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <i className="fab fa-react text-primary-400"></i>
                  <span className="text-gray-300">
                    React & Next.js for dynamic, fast-loading pages
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fab fa-js text-primary-400"></i>
                  <span className="text-gray-300">
                    Modern JavaScript for smooth interactions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fab fa-css3 text-primary-400"></i>
                  <span className="text-gray-300">
                    Tailwind CSS for stunning, responsive designs
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Backend Solutions
              </h3>
              <p className="text-gray-400 mb-6">
                We build robust, secure backends that power your website's
                features. From user authentication to data management, we ensure
                everything runs smoothly behind the scenes.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <i className="fab fa-node text-primary-400"></i>
                  <span className="text-gray-300">
                    Node.js for reliable server operations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-database text-primary-400"></i>
                  <span className="text-gray-300">
                    MongoDB & PostgreSQL for data storage
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-primary-400"></i>
                  <span className="text-gray-300">
                    Security best practices & authentication
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Performance & SEO
              </h3>
              <p className="text-gray-400 mb-6">
                We optimize your website to load quickly and rank well in search
                results. Your site will be fast, accessible, and easy for
                potential customers to find.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <i className="fas fa-tachometer-alt text-primary-400"></i>
                  <span className="text-gray-300">
                    Lightning-fast page load times
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-search text-primary-400"></i>
                  <span className="text-gray-300">
                    Search engine optimization (SEO)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-mobile-alt text-primary-400"></i>
                  <span className="text-gray-300">
                    Mobile-first responsive design
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Additional Services
              </h3>
              <p className="text-gray-400 mb-6">
                We go beyond just building websites. Our comprehensive services
                ensure your online presence is complete and effective.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <i className="fas fa-chart-line text-primary-400"></i>
                  <span className="text-gray-300">
                    Analytics setup & monitoring
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-server text-primary-400"></i>
                  <span className="text-gray-300">
                    Hosting setup & management
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-tools text-primary-400"></i>
                  <span className="text-gray-300">
                    Ongoing maintenance & support
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 reveal">
            <p className="text-gray-300 mb-8">
              Ready to bring your website idea to life? Let's create something
              amazing together.
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Start Your Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
