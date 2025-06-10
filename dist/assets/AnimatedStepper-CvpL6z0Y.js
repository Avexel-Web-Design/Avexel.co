import{r as p,j as e,f as u}from"./index-DqK9dSio.js";const k=({steps:r,className:b="",onStepChange:i})=>{var c,d;const[t,m]=p.useState(0),[v,x]=p.useState(1),s=n=>{n>=0&&n<r.length&&(x(n>t?1:-1),m(n),i==null||i(n))},g=()=>{t<r.length-1&&s(t+1)},h=()=>{t>0&&s(t-1)};return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
          .stepper-container {
            max-width: 28rem;
            margin: 0 auto;
            border-radius: 2rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                        0 10px 10px -5px rgba(0, 0, 0, 0.04);
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .step-indicator-row {
            display: flex;
            width: 100%;
            align-items: center;
            padding: 2rem;
          }

          .step-indicator {
            position: relative;
            cursor: pointer;
            outline: none;
            transition: all 0.3s ease;
          }

          .step-indicator:hover {
            transform: scale(1.1);
          }

          .step-indicator-inner {
            display: flex;
            height: 2rem;
            width: 2rem;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            font-weight: 600;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            transition: all 0.3s ease;
          }

          .step-indicator.active .step-indicator-inner {
            background: linear-gradient(135deg, #a855f7, #3b82f6);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
          }

          .step-indicator.completed .step-indicator-inner {
            background: linear-gradient(135deg, #10b981, #3b82f6);
          }

          .active-dot {
            height: 0.75rem;
            width: 0.75rem;
            border-radius: 9999px;
            background-color: #fff;
            animation: pulse 2s infinite;
          }

          .step-number {
            font-size: 0.875rem;
            color: white;
          }

          .step-connector {
            position: relative;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            height: 0.125rem;
            flex: 1;
            overflow: hidden;
            border-radius: 0.25rem;
            background-color: #374151;
          }

          .step-connector-inner {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: linear-gradient(90deg, #8b5cf6, #3b82f6);
            transition: width 0.5s ease;
          }

          .step-content {
            padding: 2rem;
            min-height: 200px;
            display: flex;
            flex-direction: column;
          }

          .stepper-nav {
            margin-top: 2.5rem;
            display: flex;
            justify-content: space-between;
            padding: 0 2rem 2rem;
          }

          .stepper-btn {
            transition: all 0.35s ease;
            border-radius: 9999px;
            padding: 0.5rem 1.5rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            outline: none;
          }

          .stepper-btn-back {
            color: #9ca3af;
            background: transparent;
          }

          .stepper-btn-back:hover:not(:disabled) {
            color: #6b7280;
            background: rgba(255, 255, 255, 0.05);
          }

          .stepper-btn-back:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .stepper-btn-next {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white;
          }

          .stepper-btn-next:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
          }

          .stepper-btn-next:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          .fade-slide-content {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
        `}}),e.jsxs("div",{className:`stepper-container ${b}`,children:[e.jsx("div",{className:"step-indicator-row",children:r.map((n,a)=>{const l=a===t,o=a<t,f=a<r.length-1;return e.jsxs(u.Fragment,{children:[e.jsx("div",{className:`step-indicator ${l?"active":""} ${o?"completed":""}`,onClick:()=>s(a),children:e.jsx("div",{className:"step-indicator-inner",children:o?e.jsx("svg",{className:"w-4 h-4 text-white",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})}):l?e.jsx("div",{className:"active-dot"}):e.jsx("span",{className:"step-number",children:a+1})})}),f&&e.jsx("div",{className:"step-connector",children:e.jsx("div",{className:"step-connector-inner",style:{width:o?"100%":"0%"}})})]},a)})}),e.jsx("div",{className:"step-content",children:e.jsxs("div",{className:"fade-slide-content",children:[e.jsx("h3",{className:"text-xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent",children:(c=r[t])==null?void 0:c.title}),e.jsx("div",{className:"flex-1 text-gray-300",children:(d=r[t])==null?void 0:d.content})]},t)}),e.jsxs("div",{className:"stepper-nav",children:[e.jsx("button",{className:"stepper-btn stepper-btn-back",onClick:h,disabled:t===0,children:"Back"}),e.jsx("button",{className:"stepper-btn stepper-btn-next",onClick:g,disabled:t===r.length-1,children:t===r.length-1?"Complete":"Continue"})]})]})]})};export{k as A};
//# sourceMappingURL=AnimatedStepper-CvpL6z0Y.js.map
