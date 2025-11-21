import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const ServiceCard = ({ icon, title, description, comingSoon = false }) => (
  <div className="glass-card p-8 rounded-2xl relative group overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <i className={`fas ${icon} text-8xl text-white`}></i>
    </div>

    <div className="relative z-10">
      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-white/10">
        <i className={`fas ${icon} text-2xl text-neon-blue`}></i>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
          {title}
        </h3>
        {comingSoon && (
          <span className="px-2 py-0.5 text-xs font-bold bg-neon-purple/20 text-neon-purple rounded-full border border-neon-purple/30">
            SOON
          </span>
        )}
      </div>

      <p className="text-gray-400 leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors cursor-pointer">
        <span>Learn more</span>
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </div>
);



const Services = () => {
  useScrollReveal();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;

        // Calculate progress based on how much of the container has scrolled past the top of the viewport
        // We want 0% when rect.top is 0 (container hits top)
        // And 100% when rect.bottom is windowHeight (container finishes scrolling)

        const totalScrollDistance = elementHeight - windowHeight;
        const currentScroll = -rect.top;

        let progress = currentScroll / totalScrollDistance;
        progress = Math.min(Math.max(progress, 0), 1);

        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    {
      title: "Discovery & Planning",
      description: "We begin by getting to know you and your business. We are people, and we value personal connections. We want to make sure that our partnership is everything you want it to be.",
      deliverables: [
        "Initial consultation and requirements gathering",
        "Project timeline and milestone definition",
        "Competitive analysis and market research"
      ]
    },
    {
      title: "Design & Collaboration",
      description: "We'll prototype an idea of a design, and initiate an ongoing dialogue with you to ensure that what we do fits with what you want. We value your input, and will never say no to your ideas.",
      deliverables: [
        "Wireframes and mockup designs",
        "Interactive prototypes for feedback",
        "Brand integration and style guide"
      ]
    },
    {
      title: "Development & QA",
      description: "We are addicted to quality and perfection. Our team will work tirelessly to bring you a website that is not only functional and fitting for your business, but one that is flawless.",
      deliverables: [
        "Clean, scalable code implementation",
        "Cross-browser and device testing",
        "Performance optimization and SEO setup"
      ]
    },
    {
      title: "Launch & Support",
      description: "Once your website is ready and live, we don't just disappear. We offer ongoing support to ensure your site remains up-to-date, and provide ways for you to make changes easily.",
      deliverables: [
        "Domain setup and deployment",
        "Training and documentation",
        "Ongoing maintenance and updates"
      ]
    }
  ];

  return (
    <section id="services" className="py-32 relative snap-start">
      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-neon-blue font-bold tracking-widest text-sm uppercase mb-4 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Services We <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Provide</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Professional web solutions crafted by passionate student developers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-32">
          <ServiceCard
            icon="fa-laptop-code"
            title="Website Creation"
            description="From concept to launch, we craft tailored websites that capture your unique vision. Our expertise ensures your site not only looks great but delivers an exceptional user experience."
          />
          <ServiceCard
            icon="fa-paint-brush"
            title="Web Design"
            description="Every pixel matters. We create distinctive, purpose-driven designs that align with your brand identity and business goals."
          />
          <ServiceCard
            icon="fa-mobile-alt"
            title="Mobile App Development"
            description="Ready to take your business mobile? We're expanding into native iOS and Android development."
            comingSoon={true}
          />
          <ServiceCard
            icon="fa-tools"
            title="Website Maintenance"
            description="We offer ongoing support and maintenance services to keep your website up to date."
          />
        </div>

      </div>

      {/* Process Section - Diagonal Scroll Journey */}
      <div ref={containerRef} className="relative h-[500vh] mb-32">
        {/* Snap Targets */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[100vh] w-full snap-start"></div>
          ))}
        </div>

        <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
          <div
            className="absolute top-0 left-0 w-full h-full transition-transform duration-100 ease-linear will-change-transform"
            style={{
              transform: `translate3d(-${scrollProgress * 400}vw, -${scrollProgress * 400}vh, 0)`
            }}
          >
            {/* Intro Step */}
            <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center p-6">
              <div className="max-w-4xl text-center">
                <h3 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                  Our <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Approach</span>
                </h3>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  We don't just build websites; we craft digital experiences. Scroll to embark on the journey from concept to reality.
                </p>
              </div>
            </div>

            {/* Steps */}
            {steps.map((step, index) => (
              <div
                key={index}
                className="absolute w-screen h-screen flex items-center justify-center p-6"
                style={{
                  left: `${(index + 1) * 100}vw`,
                  top: `${(index + 1) * 100}vh`
                }}
              >
                <div className="relative max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
                  {/* Number & Visual */}
                  <div className={`relative ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="text-[20rem] font-bold text-white/5 absolute -top-20 -left-20 select-none leading-none">
                      0{index + 1}
                    </div>
                    <div className="relative z-10 glass-panel p-12 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                        <span className="text-4xl font-bold text-white">0{index + 1}</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-neon-purple to-neon-blue w-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <h4 className="text-4xl md:text-6xl font-bold text-white mb-8">{step.title}</h4>
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                      {step.description}
                    </p>
                    <ul className="space-y-4">
                      {step.deliverables.map((deliverable, i) => (
                        <li key={i} className="flex items-center gap-4 text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-neon-blue"></div>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section >
  );
};

export default Services;
