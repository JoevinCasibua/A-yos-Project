import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full appearance-none border rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-danger' : 'border-gray-300'
          }`}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => {
            if (typeof opt === 'string') {
              return <option key={opt} value={opt}>{opt}</option>;
            }
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
};

export default Select;
