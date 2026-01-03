import React, { useId } from 'react';


const Input = ({ label, error, helperText, rightElement, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={inputId}
          className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1 cursor-pointer select-none hover:text-nothing-white transition-colors"
        >
          {label}
        </label>
        {error && (
          <span className="text-xs font-mono text-nothing-red tracking-wide uppercase animate-pulse">
            {error}
          </span>
        )}
      </div>
      <div className="relative group">
        <input
          id={inputId}
          className={`
            w-full bg-nothing-dark border rounded-xl p-4 
            text-nothing-white placeholder-nothing-muted 
            outline-none 
            transition-all duration-300
            focus:border-nothing-white focus:ring-1 focus:ring-nothing-white/20
            disabled:opacity-50 disabled:cursor-not-allowed
            [color-scheme:dark]
            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
            file:text-xs file:font-semibold file:bg-nothing-white file:text-nothing-black
            file:hover:bg-neutral-200
            [&::-webkit-calendar-picker-indicator]:opacity-50
            [&::-webkit-calendar-picker-indicator]:hover:opacity-100
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
            [&::-webkit-calendar-picker-indicator]:p-1
            ${error
              ? 'border-nothing-red focus:border-nothing-red'
              : 'border-nothing-gray'
            }
              ${rightElement ? 'pr-12' : ''}
            ${className}
            `}
          aria-invalid={!!error}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-nothing-muted">
            {rightElement}
          </div>
        )}
      </div>
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-[10px] text-nothing-muted ml-1 font-mono opacity-80">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;