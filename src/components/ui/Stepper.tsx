import { Check } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;
          
          return (
            <li key={step.id} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={classNames(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-smooth',
                    isComplete && 'bg-[#ff6b9d] text-white',
                    isCurrent && 'bg-[#3b1f1e] text-white ring-4 ring-[#ffd1dc]',
                    isUpcoming && 'bg-[#ffd1dc] text-[#7d4f45]'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {/* Step label */}
                <span
                  className={classNames(
                    'mt-2 text-xs sm:text-sm font-medium text-center transition-smooth',
                    isCurrent && 'text-[#3b1f1e]',
                    (isComplete || isUpcoming) && 'text-[#7d4f45]'
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={classNames(
                    'absolute top-5 left-1/2 w-full h-0.5 transition-smooth -z-10',
                    isComplete ? 'bg-[#ff6b9d]' : 'bg-[#ffd1dc]'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

