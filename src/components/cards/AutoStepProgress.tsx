interface AutoStepProgressProps {
  data: Record<string, unknown>;
}

export function AutoStepProgress({ data }: AutoStepProgressProps) {
  const steps = (data.steps as string[]) ?? ['需求分析', '保障检视', '方案推荐'];
  const currentStep = (data.currentStep as number) ?? 0;

  return (
    <div className="crystal rounded-[24px] px-4 py-3 border border-white/80">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-1.5">
              {/* Step indicator */}
              {index < currentStep ? (
                <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : index === currentStep ? (
                <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#94a3b8]" />
                </div>
              )}
              <span
                className={`text-xs font-medium ${
                  index < currentStep
                    ? 'text-[#10B981]'
                    : index === currentStep
                      ? 'text-[#3B82F6]'
                      : 'text-[#94a3b8]'
                }`}
              >
                {step}
              </span>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="mx-2 flex-shrink-0">
                <div
                  className={`w-8 h-0.5 ${
                    index < currentStep ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
