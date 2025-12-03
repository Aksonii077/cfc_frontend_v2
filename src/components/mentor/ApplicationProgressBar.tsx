// React & Hooks
import { useMemo } from "react";

// Icons
import {
  Clock,
  Calendar,
  CheckCircle,
  UserPlus,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface ApplicationProgressBarProps {
  status: "review-pending" | "interview-scheduled" | "interview-completed" | "accepted" | "rejected" | "agreement-started" | "agreement-in-progress" | "agreement-complete";
}

export function ApplicationProgressBar({ status }: ApplicationProgressBarProps) {
  const steps = [
    { id: 1, label: "Review Pending", status: "review-pending", icon: Clock },
    { id: 2, label: "Interview Scheduled", status: "interview-scheduled", icon: Calendar },
    { id: 3, label: "Interview Completed", status: "interview-completed", icon: CheckCircle },
    { id: 4, label: "Accepted", status: "accepted", icon: UserPlus },
    { id: 5, label: "Agreement Started", status: "agreement-started", icon: FileText },
    { id: 6, label: "Agreement In Progress", status: "agreement-in-progress", icon: Activity },
    { id: 7, label: "Agreement Complete", status: "agreement-complete", icon: CheckCircle2 },
  ];

  const currentStepIndex = useMemo(() => {
    if (status === "rejected") return 0;
    return steps.findIndex(step => step.status === status);
  }, [status]);

  const currentStep = currentStepIndex + 1;

  if (status === "rejected") {
    return (
      <div className="bg-[#FFE5E5] border border-[#FF220E]/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Application Progress</span>
          <span className="text-[#FF220E]">Rejected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700">Application Progress</span>
        <span className="text-gray-500">Step {currentStep} of 7</span>
      </div>

      {/* Progress Line */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#C8D6FF]"></div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] transition-all duration-500"
          style={{ 
            width: currentStepIndex === 0 ? '0%' : `${((currentStepIndex) / 6) * 100}%`
          }}
        ></div>

        {/* Steps */}
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center justify-start flex-1">
                {/* Step Circle */}
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white flex-shrink-0
                    ${isActive ? 'border-[#114DFF]' : ''}
                    ${isCompleted ? 'border-[#06CB1D]' : ''}
                    ${isPending ? 'border-[#CCCCCC]' : ''}
                  `}
                >
                  <StepIcon 
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-[#114DFF]' : 
                      isCompleted ? 'text-[#06CB1D]' : 
                      'text-[#CCCCCC]'
                    }`} 
                  />
                </div>

                {/* Step Label - Hidden on mobile, shown on larger screens */}
                <div className="text-center mt-2 hidden lg:block min-w-0 px-1">
                  <span 
                    className={`text-xs leading-tight block ${
                      isActive ? 'text-[#114DFF]' : 
                      isCompleted ? 'text-gray-700' : 
                      'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Label - Mobile friendly */}
      <div className="mt-3 lg:hidden text-center">
        <span className="text-[#114DFF]">
          {steps[currentStepIndex]?.label}
        </span>
      </div>
    </div>
  );
}
