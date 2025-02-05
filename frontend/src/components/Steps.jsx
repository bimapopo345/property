import React from 'react';
import { steps } from '../assets/stepsdata';
import { ArrowRight } from 'lucide-react';

function Step({ icon: Icon, title, description, stepNumber }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 relative">
        <Icon className="h-8 w-8 text-blue-600" />
        
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-xs">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finding your perfect property is easy with our simple three-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <Step
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepNumber={index + 1}
              />
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute items-center"
                  style={{ left: `${(index + 1) * (100 / 3) - 8}%`, top: '8%', transform: 'translateX(-50%)' }}
                >
                  
                
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
