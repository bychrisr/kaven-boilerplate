import * as React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormWizardStep {
  label: string;
  description?: string;
  optional?: boolean;
  content: React.ReactNode;
}

export interface FormWizardProps {
  /**
   * Steps
   */
  steps: FormWizardStep[];
  /**
   * Current step (controlled)
   */
  activeStep?: number;
  /**
   * Callback when step changes
   */
  onStepChange?: (step: number) => void;
  /**
   * Callback when wizard completes
   */
  onComplete?: () => void;
  /**
   * Validate step before proceeding
   */
  onValidateStep?: (step: number) => boolean | Promise<boolean>;
  /**
   * Show step numbers
   */
  showStepNumbers?: boolean;
}

export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  activeStep: controlledStep,
  onStepChange,
  onComplete,
  onValidateStep,
  showStepNumbers = true,
}) => {
  const [internalStep, setInternalStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [isValidating, setIsValidating] = React.useState(false);

  const currentStep = controlledStep ?? internalStep;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    // Validate current step
    if (onValidateStep) {
      setIsValidating(true);
      const isValid = await onValidateStep(currentStep);
      setIsValidating(false);

      if (!isValid) return;
    }

    // Mark step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (isLastStep) {
      onComplete?.();
    } else {
      const nextStep = currentStep + 1;
      setInternalStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setInternalStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or current step
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setInternalStep(step);
      onStepChange?.(step);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.includes(index);
          const isClickable = index <= currentStep || completedSteps.includes(index - 1);

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    'flex items-center justify-center size-10 rounded-full border-2 transition-all',
                    isActive && 'border-primary-main bg-primary-main text-white',
                    isCompleted && !isActive && 'border-primary-main bg-primary-main text-white',
                    !isActive && !isCompleted && 'border-gray-300 text-text-secondary',
                    isClickable && 'cursor-pointer hover:border-primary-main',
                    !isClickable && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5" />
                  ) : showStepNumbers ? (
                    <span className="text-sm font-medium">{index + 1}</span>
                  ) : null}
                </button>
                <div className="text-center">
                  <div className={cn('text-sm font-medium', isActive && 'text-primary-main')}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-text-secondary">{step.description}</div>
                  )}
                  {step.optional && (
                    <div className="text-xs text-text-secondary italic">Opcional</div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    completedSteps.includes(index) ? 'bg-primary-main' : 'bg-gray-300'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">{steps[currentStep].content}</div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-divider">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
            'border border-gray-300 hover:bg-action-hover',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <ChevronLeft className="size-4" />
          Voltar
        </button>

        <div className="text-sm text-text-secondary">
          Passo {currentStep + 1} de {steps.length}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={isValidating}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
            'bg-primary-main text-white hover:bg-primary-dark',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isValidating ? (
            'Validando...'
          ) : isLastStep ? (
            'Concluir'
          ) : (
            <>
              Próximo
              <ChevronRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

FormWizard.displayName = 'FormWizard';
