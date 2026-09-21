"use client";

import React, { useState, ChangeEvent, FocusEvent, ReactNode } from 'react';

interface InputFieldProps {
  id?: string;
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  min?: string | number;
  max?: string | number;
  className?: string;
  inputClassName?: string;
  icon?: ReactNode;
  showEyeToggle?: boolean;
  password?: boolean;
}

export const InputField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  multiline = false,
  rows = 4,
  min,
  max,
  className = '',
  inputClassName = '',
  icon,
  showEyeToggle = false,
  password = false,
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isTextarea = multiline || type === 'textarea';
  const actualType = password && !isPasswordVisible ? 'password' : type;

  return (
    <div className={`${className} space-y-2`}>
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
        {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-primary/50">
            {icon}
          </div>
        )}
        {showEyeToggle && password && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-primary/50 hover:text-primary"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? '👁' : '👁‍🗨️'}
          </button>
        )}
        {isTextarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`block w-full rounded-input border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none ${disabled ? 'bg-surface-muted opacity-60' : ''} ${error ? 'border-error' : ''} ${inputClassName}`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={actualType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            className={`block w-full rounded-input border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none ${disabled ? 'bg-surface-muted opacity-60' : ''} ${error ? 'border-error' : ''} ${icon ? 'pl-10' : ''} ${inputClassName}`}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
};