"use client";

import React, { useState } from "react";

export interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  error?: string | null;
  bgClass?: string;
}

export function LuxuryInput({
  label,
  id,
  required = false,
  error: externalError,
  bgClass = "bg-[#080808]",
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  className = "",
  ...props
}: LuxuryInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const stringVal = value !== undefined && value !== null ? String(value) : "";
  const hasValue = stringVal.trim().length > 0;
  const isFloating = isFocused || hasValue;

  const isInvalid = (isTouched || externalError) && required && !hasValue;
  const displayError = externalError || (isInvalid ? "This field is required." : null);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setIsTouched(true);
            onBlur?.(e);
          }}
          placeholder=" "
          aria-invalid={!!displayError}
          className={`peer block w-full px-3.5 pt-4 pb-2 text-xs sm:text-sm text-white bg-transparent rounded-none border transition-colors outline-none font-serif ${
            displayError
              ? "border-rose-600 focus:border-rose-500"
              : isFocused
              ? "border-[#a7c080]"
              : "border-[#333] hover:border-neutral-500"
          }`}
          {...props}
        />

        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 left-3 z-10 px-1 font-serif tracking-wider uppercase ${bgClass} ${
            isFloating
              ? `-top-2 text-[10px] leading-none ${
                  displayError
                    ? "text-rose-400 font-semibold"
                    : isFocused
                    ? "text-[#a7c080] font-semibold"
                    : "text-neutral-400 font-medium"
                }`
              : `top-3 text-xs sm:text-sm ${
                  displayError ? "text-rose-400" : "text-neutral-500"
                }`
          }`}
        >
          {label} {required && <span className="text-[#a7c080] font-mono">*</span>}
        </label>
      </div>

      {displayError && (
        <p className="mt-1 text-[11px] text-rose-400 font-serif leading-none tracking-wide animate-in fade-in duration-150">
          {displayError}
        </p>
      )}
    </div>
  );
}

export interface LuxuryTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  required?: boolean;
  error?: string | null;
  bgClass?: string;
}

export function LuxuryTextarea({
  label,
  id,
  required = false,
  error: externalError,
  bgClass = "bg-[#080808]",
  value,
  onChange,
  onFocus,
  onBlur,
  rows = 3,
  className = "",
  ...props
}: LuxuryTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const stringVal = value !== undefined && value !== null ? String(value) : "";
  const hasValue = stringVal.trim().length > 0;
  const isFloating = isFocused || hasValue;

  const isInvalid = (isTouched || externalError) && required && !hasValue;
  const displayError = externalError || (isInvalid ? "This field is required." : null);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setIsTouched(true);
            onBlur?.(e);
          }}
          placeholder=" "
          aria-invalid={!!displayError}
          className={`peer block w-full px-3.5 pt-4 pb-2 text-xs sm:text-sm text-white bg-transparent rounded-none border transition-colors outline-none font-serif ${
            displayError
              ? "border-rose-600 focus:border-rose-500"
              : isFocused
              ? "border-[#a7c080]"
              : "border-[#333] hover:border-neutral-500"
          }`}
          {...props}
        />

        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 left-3 z-10 px-1 font-serif tracking-wider uppercase ${bgClass} ${
            isFloating
              ? `-top-2 text-[10px] leading-none ${
                  displayError
                    ? "text-rose-400 font-semibold"
                    : isFocused
                    ? "text-[#a7c080] font-semibold"
                    : "text-neutral-400 font-medium"
                }`
              : `top-3.5 text-xs sm:text-sm ${
                  displayError ? "text-rose-400" : "text-neutral-500"
                }`
          }`}
        >
          {label} {required && <span className="text-[#a7c080] font-mono">*</span>}
        </label>
      </div>

      {displayError && (
        <p className="mt-1 text-[11px] text-rose-400 font-serif leading-none tracking-wide animate-in fade-in duration-150">
          {displayError}
        </p>
      )}
    </div>
  );
}

export interface LuxurySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  bgClass?: string;
}

export function LuxurySelect({
  label,
  id,
  required = false,
  options,
  bgClass = "bg-[#080808]",
  value,
  onChange,
  onFocus,
  onBlur,
  className = "",
  ...props
}: LuxurySelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={`block w-full px-3.5 pt-4 pb-2 text-xs sm:text-sm text-white bg-[#080808] rounded-none border transition-colors outline-none font-serif cursor-pointer ${
            isFocused ? "border-[#a7c080]" : "border-[#333] hover:border-neutral-500"
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111111] text-white py-1">
              {opt.label}
            </option>
          ))}
        </select>

        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 left-3 -top-2 z-10 px-1 font-serif tracking-wider uppercase text-[10px] leading-none ${bgClass} ${
            isFocused ? "text-[#a7c080] font-semibold" : "text-neutral-400 font-medium"
          }`}
        >
          {label} {required && <span className="text-[#a7c080] font-mono">*</span>}
        </label>
      </div>
    </div>
  );
}
