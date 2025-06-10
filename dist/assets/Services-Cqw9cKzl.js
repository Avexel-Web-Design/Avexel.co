import{j as e}from"./index-DqK9dSio.js";import{u as n}from"./useScrollReveal-BLBkWjJc.js";import{A as l}from"./AnimatedStepper-CvpL6z0Y.js";import{P as c}from"./PixelCard-CP-C070s.js";import{A as r}from"./AnimatedOrb-Bme7Sxfu.js";const d=`
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
`,t=({icon:s,title:a,description:i,comingSoon:o=!1})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:d}}),e.jsx(c,{className:"group service-card h-full",children:e.jsxs("div",{className:"relative flex flex-col h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-colors duration-300",children:[e.jsxs("div",{className:"mb-6 relative",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-300"}),e.jsx("div",{className:"relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12",children:e.jsx("i",{className:`fas ${s} text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`})})]}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("h3",{className:"text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300",children:a}),o&&e.jsx("span",{className:"px-2.5 py-0.5 text-xs font-semibold bg-secondary-500/10 text-secondary-400 rounded-full border border-secondary-500/20 animate-pulse",children:"Coming Soon"})]}),e.jsx("p",{className:"text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300",children:i})]}),e.jsx("div",{className:"mt-6 pt-6 border-t border-white/5",children:e.jsxs("div",{className:"flex items-center text-primary-400 group-hover:text-primary-300 transition-colors duration-300",children:[e.jsx("span",{className:"mr-2 font-medium",children:"Learn more"}),e.jsx("svg",{className:"w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M13 5L20 12M20 12L13 19M20 12H4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]})})]})})]}),g=()=>(n(),e.jsxs("section",{id:"services",className:"py-20 bg-black relative overflow-hidden scroll-mt-16",children:["      ",e.jsx("div",{className:"absolute top-0 left-0 w-full h-1/3 bg-grid-pattern opacity-5"}),e.jsx("div",{className:"absolute top-1/4 right-1/6 w-64 h-64 border border-white/5 animate-spin-slow"}),e.jsx("div",{className:"absolute bottom-1/3 left-1/5 w-48 h-48 border border-white/5 rounded-full animate-spin-slow-reverse"}),e.jsx("div",{className:"absolute top-1/3 left-1/12 opacity-15",children:e.jsx(r,{size:"sm",hue:220,hoverIntensity:.1})}),e.jsx("div",{className:"absolute bottom-1/4 right-1/8 opacity-20",children:e.jsx(r,{size:"md",hue:260,hoverIntensity:.15})}),e.jsxs("div",{className:"container mx-auto px-4 lg:px-8 relative z-10",children:[e.jsxs("div",{className:"max-w-3xl mx-auto text-center mb-12 reveal stagger-reveal",children:[e.jsx("span",{className:"inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4",children:"Our Expertise"}),e.jsx("h2",{className:"text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:"Services We Provide"}),e.jsx("p",{className:"text-lg text-gray-300",children:"Professional web solutions crafted by passionate student developers, for the lowest prices and of the highest quality."})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-8 reveal",children:[e.jsx(t,{icon:"fa-laptop-code",title:"Website Creation",description:"From concept to launch, we craft tailored websites that capture your unique vision. Our expertise ensures your site not only looks great but delivers an exceptional user experience across all devices, helping you establish a strong digital presence."}),e.jsx(t,{icon:"fa-paint-brush",title:"Web Design",description:"Every pixel matters. We create distinctive, purpose-driven designs that align with your brand identity and business goals. Our approach ensures that your website is meaningful to you and to your audience, ensuring commitment to what matters most to you."}),e.jsx(t,{icon:"fa-mobile-alt",title:"Mobile App Development",description:"Ready to take your business mobile? We're expanding into native iOS and Android development, helping you reach customers wherever they are. From concept validation to App Store launch, we'll guide you through the entire process.",comingSoon:!0}),e.jsx(t,{icon:"fa-tools",title:"Website Maintenance",description:"Not everyone has the time or expertise to be a programmer. We offer ongoing support and maintenance services to keep your website up to date. We also provide an easy way for you to make changes to your site in seconds without ever touching code."})]}),"        ",e.jsxs("div",{className:"mt-20 reveal",children:[e.jsx("h3",{className:"text-3xl font-bold mb-16 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:"Our Approach"}),e.jsx("div",{className:"relative",children:e.jsx(l,{steps:[{title:"Discovery & Planning",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-gray-300 leading-relaxed",children:"We begin by getting to know you and your business. We are people, and we value personal connections. We want to make sure that our partnership is everything you want it to be."}),e.jsxs("div",{className:"flex items-center gap-2 text-primary-400",children:[e.jsx("i",{className:"fas fa-lightbulb"}),e.jsx("span",{className:"text-sm",children:"Understanding your vision and goals"})]})]})},{title:"Design & Collaboration",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-gray-300 leading-relaxed",children:"We'll prototype an idea of a design, and initiate an ongoing dialogue with you to ensure that what we do fits with what you want. We value your input, and will never say no to your ideas."}),e.jsxs("div",{className:"flex items-center gap-2 text-primary-400",children:[e.jsx("i",{className:"fas fa-palette"}),e.jsx("span",{className:"text-sm",children:"Collaborative design process"})]})]})},{title:"Development & Quality Assurance",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-gray-300 leading-relaxed",children:"We are addicted to quality and perfection. Our team will work tirelessly to bring you a website that is not only functional and fitting for your business, but one that is flawless and long-lasting."}),e.jsxs("div",{className:"flex items-center gap-2 text-primary-400",children:[e.jsx("i",{className:"fas fa-code"}),e.jsx("span",{className:"text-sm",children:"Clean, efficient, and tested code"})]})]})},{title:"Launch & Ongoing Support",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-gray-300 leading-relaxed",children:"Once your website is ready and live, we don't just disappear. We offer ongoing support to ensure your site remains up-to-date, and provide ways for you to make changes without needing to know how to code."}),e.jsxs("div",{className:"flex items-center gap-2 text-primary-400",children:[e.jsx("i",{className:"fas fa-rocket"}),e.jsx("span",{className:"text-sm",children:"Continued partnership and support"})]})]})}],className:"max-w-2xl mx-auto"})})]}),e.jsx("div",{className:"mt-20 reveal",children:e.jsxs("div",{className:"relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:"Supporting FIRST Robotics"}),e.jsx("p",{className:"text-gray-300 mt-4 max-w-2xl mx-auto",children:"Your partnership with us directly supports Baywatch Robotics (FRC Team 7790), a competitive high school robotics team from Harbor Springs, Michigan. Your project helps fund our robot parts, competition registration fees, travel expenses, and STEM outreach activities in our community. Our team is comprised solely of members of this team. Members who know that your support is what allows us to excel, and what has allowed us in the past to compete at an international level."})]}),e.jsx("div",{className:"flex justify-center mt-6",children:e.jsx("a",{href:"https://frc7790.com",target:"_blank",rel:"noopener noreferrer",className:"inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300",children:"Visit Our Robotics Team"})})]})})]})]}));export{g as default};
//# sourceMappingURL=Services-Cqw9cKzl.js.map
