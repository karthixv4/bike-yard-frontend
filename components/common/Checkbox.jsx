import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group select-none"
      onClick={() => onChange(!checked)}
    >
      <div className={`
        w-6 h-6 border rounded-md flex items-center justify-center transition-all duration-300
        ${checked 
          ? 'bg-nothing-red border-nothing-red' 
          : 'bg-nothing-dark border-nothing-gray group-hover:border-nothing-white'
        }
      `}>
        {checked && <Check size={16} className="text-white" strokeWidth={3} />}
      </div>
      <span className={`font-mono text-sm transition-colors ${checked ? 'text-nothing-white' : 'text-nothing-muted'}`}>
        {label}
      </span>
    </div>
  );
};

export default Checkbox;