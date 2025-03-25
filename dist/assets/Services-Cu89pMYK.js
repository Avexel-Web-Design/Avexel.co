import{j as e}from"./index-CwHMxabV.js";import{u as n}from"./useScrollReveal-Cps71qcx.js";const l=`
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes spin {
    from {
      --angle: 0deg;
    }
    to {
      --angle: 360deg;
    }
  }

  .service-card {
    position: relative;
  }

  .service-card::after, 
  .service-card::before {
    content: '';
    position: absolute;
    height: calc(100% + 6px);
    width: calc(100% + 6px);
    background-image: conic-gradient(from var(--angle), 
      #1902a4, /* blue-500 */
      #ba60dc, /* indigo-600 */
      #1902a4  /* blue-500 */
    );
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: -1;
    border-radius: 12px;
    animation: 3s spin linear infinite;
  }

  .service-card::before {
    filter: blur(0.5rem);
    opacity: 0.5;
  }
  
  /* Glass morphism styling - without glowing borders */
  .glass-morphism {
    position: relative;
    background-color: rgba(0, 0, 0, 0.75);
  }
  
  .glass-morphism > div {
    position: relative;
    z-index: 1;
  }
`,t=({icon:r,title:i,description:a,comingSoon:o=!1})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:l}}),e.jsx("div",{className:"group relative service-card",children:e.jsxs("div",{className:"relative flex flex-col h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-colors duration-300",children:[e.jsxs("div",{className:"mb-6 relative",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-300"}),e.jsx("div",{className:"relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300",children:e.jsx("i",{className:`fas ${r} text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`})})]}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("h3",{className:"text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:i}),o&&e.jsx("span",{className:"px-2.5 py-0.5 text-xs font-semibold bg-secondary-500/10 text-secondary-400 rounded-full border border-secondary-500/20",children:"Coming Soon"})]}),e.jsx("p",{className:"text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300",children:a})]}),e.jsx("div",{className:"mt-6 pt-6 border-t border-white/5",children:e.jsxs("div",{className:"flex items-center text-primary-400 group-hover:text-primary-300 transition-colors duration-300",children:[e.jsx("span",{className:"mr-2 font-medium",children:"Learn more"}),e.jsx("svg",{className:"w-4 h-4 transition-transform duration-300 group-hover:translate-x-1",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M13 5L20 12M20 12L13 19M20 12H4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]})})]})})]}),s=({number:r,title:i,description:a})=>e.jsxs("div",{className:"relative group",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center gap-6",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"}),e.jsx("div",{className:"relative w-16 h-16 rounded-full bg-dark flex items-center justify-center ring-1 ring-primary-500/30 group-hover:ring-primary-500/70 transition-all duration-300",children:e.jsx("span",{className:"text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:r})})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"text-xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:i}),e.jsx("p",{className:"text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300",children:a})]})]}),r<4&&e.jsx("div",{className:"hidden md:block absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-secondary-500/50"})]}),m=()=>(n(),e.jsxs("section",{id:"services",className:"py-20 bg-black relative overflow-hidden scroll-mt-16",children:[e.jsx("div",{className:"absolute top-0 left-0 w-full h-1/3 bg-grid-pattern opacity-5"}),e.jsx("div",{className:"absolute top-1/4 right-1/6 w-64 h-64 border border-white/5 animate-spin-slow"}),e.jsx("div",{className:"absolute bottom-1/3 left-1/5 w-48 h-48 border border-white/5 rounded-full animate-spin-slow-reverse"}),e.jsxs("div",{className:"container mx-auto px-4 lg:px-8 relative z-10",children:[e.jsxs("div",{className:"max-w-3xl mx-auto text-center mb-12 reveal stagger-reveal",children:[e.jsx("span",{className:"inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4",children:"Our Expertise"}),e.jsx("h2",{className:"text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:"Services We Provide"}),e.jsx("p",{className:"text-lg text-gray-300",children:"Professional web solutions crafted by passionate student developers, supporting the future of FIRST Robotics Team 7790."})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-8 reveal",children:[e.jsx(t,{icon:"fa-laptop-code",title:"Website Creation",description:"From concept to launch, we craft tailored websites that capture your unique vision. Our expertise ensures your site not only looks great but delivers an exceptional user experience across all devices, helping you establish a strong digital presence."}),e.jsx(t,{icon:"fa-paint-brush",title:"Web Design",description:"Every pixel matters. We create distinctive, purpose-driven designs that align with your brand identity and business goals. Our approach ensures that your website is meaningful to you and to your audience, ensuring commitment to what matters most to you."}),e.jsx(t,{icon:"fa-mobile-alt",title:"Mobile App Development",description:"Ready to take your business mobile? We're expanding into native iOS and Android development, helping you reach customers wherever they are. From concept validation to App Store launch, we'll guide you through the entire process.",comingSoon:!0}),e.jsx(t,{icon:"fa-tools",title:"Website Maintenance",description:"Keep your digital presence running smoothly with our reliable maintenance services. We handle everything from security updates and performance optimization to content updates, letting you focus on what matters most."})]}),e.jsxs("div",{className:"mt-20 reveal",children:[e.jsx("h3",{className:"text-3xl font-bold mb-16 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:"Our Approach"}),e.jsxs("div",{className:"relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5",children:[e.jsxs("div",{className:"absolute inset-0 overflow-hidden rounded-xl",children:[e.jsx("div",{className:"absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary-500/5 to-transparent opacity-60 blur-xl"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-secondary-500/5 to-transparent opacity-60 blur-xl"})]}),e.jsxs("div",{className:"relative z-10 space-y-12",children:[e.jsx(s,{number:"1",title:"Discovery & Planning",description:"We begin with an in-depth conversation to understand your vision, goals, and requirements. Our flexible scheduling ensures we can meet at a time that works best for you, whether after school or on weekends."}),e.jsx(s,{number:"2",title:"Design & Collaboration",description:"We transform your ideas into visual concepts, creating mockups that align with your brand. Through collaborative feedback, we refine the design until it perfectly matches your vision."}),e.jsx(s,{number:"3",title:"Development & Quality Assurance",description:"Our development team brings your website to life, implementing modern best practices and rigorous testing across all devices and browsers to ensure a flawless user experience."}),e.jsx(s,{number:"4",title:"Launch & Ongoing Support",description:"Once your site meets our quality standards, we guide you through the launch process and provide comprehensive training. We remain available for support, ensuring your continued success in the digital space."})]})]})]}),e.jsx("div",{className:"mt-20 reveal",children:e.jsxs("div",{className:"relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:"Supporting FIRST Robotics"}),e.jsx("p",{className:"text-gray-300 mt-4 max-w-2xl mx-auto",children:"Your partnership with us directly supports Baywatch Robotics (FRC Team 7790), a competitive high school robotics team from Harbor Springs, Michigan. Your project helps fund our robot parts, competition registration fees, travel expenses, and STEM outreach activities in our community."})]}),e.jsx("div",{className:"flex justify-center mt-6",children:e.jsx("a",{href:"https://frc7790.com",target:"_blank",rel:"noopener noreferrer",className:"inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300",children:"Visit Our Robotics Team"})})]})})]})]}));export{m as default};
//# sourceMappingURL=Services-Cu89pMYK.js.map
