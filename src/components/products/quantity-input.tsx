"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min?: number;
  className?: string;
  inputClassName?: string;
}

export function QuantityInput({
  value,
  onChange,
  max,
  min = 1,
  className = "",
  inputClassName = "",
}: QuantityInputProps) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const clamp = (num: number) => Math.max(min, Math.min(max, num));

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < min) {
      onChange(min);
      setInputValue(String(min));
      return;
    }
    const clamped = clamp(parsed);
    onChange(clamped);
    setInputValue(String(clamped));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="rounded border border-gray-300 p-1.5 hover:border-[#F59E0B] disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => commit(inputValue)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        className={`w-16 rounded border border-gray-300 px-2 py-1.5 text-center text-sm font-semibold focus:border-[#F59E0B] focus:outline-none ${inputClassName}`}
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="rounded border border-gray-300 p-1.5 hover:border-[#F59E0B] disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
