import React from 'react';
import { AppStep } from '../types';
import { Lightbulb, Workflow, ListTodo, Database, Palette, FileText } from 'lucide-react';

interface Props {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.Idea, label: '想法起點', icon: Lightbulb },
  { id: AppStep.Flow, label: '操作流程', icon: Workflow },
  { id: AppStep.Features, label: '功能清單', icon: ListTodo },
  { id: AppStep.Data, label: '資料記憶', icon: Database },
  { id: AppStep.Style, label: '風格品質', icon: Palette },
  { id: AppStep.Result, label: '生成結果', icon: FileText },
];

export const StepIndicator: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="w-full py-8 px-4 flex justify-center overflow-x-auto">
      <div className="flex items-center min-w-max space-x-4 lg:space-x-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative group">
              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 z-0 ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}`} 
                     style={{ width: 'calc(100% + 2rem)' }} />
              )}
              
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300
                  ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 
                    isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
              >
                <Icon size={20} />
              </div>
              <span className={`mt-2 text-xs font-medium transition-colors duration-300
                ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
