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
    <div className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-500">
      {/* Icon */}
      <div className="mb-8 relative inline-block">
        <div className="absolute inset-0 bg-neon-purple/20 blur-xl rounded-full group-hover:bg-neon-purple/40 transition-colors duration-300"></div>
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <i className={`fas ${icon} text-2xl text-white group-hover:text-neon-purple transition-colors duration-300`}></i>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white font-outfit group-hover:text-neon-purple transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>

        {/* Stats */}
        <div className="pt-6 border-t border-white/5 mt-6">
          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue counter"
              data-target={target}
            >
              {startValue}
            </span>
            <span className="text-xl text-gray-500 font-medium">
              {suffix}
            </span>
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
    <section id="capabilities" className="py-32 bg-[#050505] relative overflow-hidden snap-start">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24 reveal">
            <span className="inline-block text-sm font-bold text-neon-blue tracking-[0.2em] uppercase mb-4 animate-float">
              What We Do Best
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-outfit">
              Our Technical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                Expertise
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We bring together creativity and innovation to build websites that are functional, beautiful, and tailored to your needs.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 reveal">
            <CapabilityCard
              icon="fa-code"
              title="Frontend Development"
              description="We craft beautiful interfaces that work flawlessly across all devices. Our websites don't just look good – they provide an intuitive experience that engages users."
              target="100"
              suffix="%"
              startValue={0}
            />

            <CapabilityCard
              icon="fa-server"
              title="Backend Solutions"
              description="We build robust, secure backends that power your website's features. From admin panels to eCommerce platforms, we provide everything you need."
              target="99.9"
              suffix="% Uptime"
              startValue={0}
            />

            <CapabilityCard
              icon="fa-rocket"
              title="Performance & SEO"
              description="We optimize your website to load quickly and rank well in search results. Your site will be fast, accessible, and easy for potential customers to find."
              target="95"
              suffix="+ Score"
              startValue={0}
            />

            <CapabilityCard
              icon="fa-tools"
              title="Additional Services"
              description="We go beyond just building websites. Our comprehensive services ensure that building and maintaining your online presence is simple and stress-free."
              target="24"
              suffix="/7 Support"
              startValue={0}
            />
          </div>

          {/* CTA */}
          <div className="text-center mt-20 reveal">
            <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-neon-purple via-white to-neon-blue">
              <a
                href="#contact"
                className="block px-10 py-4 bg-black rounded-full text-white font-bold hover:bg-white/10 transition-colors duration-300"
              >
                Start Your Project <i className="fas fa-arrow-right ml-2 text-neon-purple"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
