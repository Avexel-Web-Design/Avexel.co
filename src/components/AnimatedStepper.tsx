import React, { useState, useEffect } from "react";

interface AnimatedStepperProps {
  steps: Array<{
    title: string;
    content: React.ReactNode;
  }>;
  className?: string;
  onStepChange?: (step: number) => void;
}

const AnimatedStepper: React.FC<AnimatedStepperProps> = ({
  steps,
  className = "",
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const updateStep = (newStep: number) => {
    if (newStep >= 0 && newStep < steps.length) {
      setDirection(newStep > currentStep ? 1 : -1);
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      updateStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      updateStep(currentStep - 1);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
      
      <div className={`stepper-container ${className}`}>
        {/* Step Indicators */}
        <div className="step-indicator-row">
          {steps.map((_, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isNotLastStep = index < steps.length - 1;
            
            return (
              <React.Fragment key={index}>
                <div
                  className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => updateStep(index)}
                >
                  <div className="step-indicator-inner">
                    {isCompleted ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : isActive ? (
                      <div className="active-dot" />
                    ) : (
                      <span className="step-number">{index + 1}</span>
                    )}
                  </div>
                </div>
                
                {isNotLastStep && (
                  <div className="step-connector">
                    <div 
                      className="step-connector-inner" 
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="step-content">
          <div key={currentStep} className="fade-slide-content">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {steps[currentStep]?.title}
            </h3>
            <div className="flex-1 text-gray-300">
              {steps[currentStep]?.content}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="stepper-nav">
          <button
            className="stepper-btn stepper-btn-back"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Back
          </button>
          
          <button
            className="stepper-btn stepper-btn-next"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AnimatedStepper;