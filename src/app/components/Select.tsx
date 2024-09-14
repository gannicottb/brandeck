"use client"
import { ChangeEventHandler } from "react"

interface SelectOption {
  label: string
  value: string
}
export interface SelectProps {
  label?: string
  value: string
  options: SelectOption[]
  onChange: ChangeEventHandler<HTMLSelectElement>
  className: string
}
export const Select = ({ label, value, options, onChange, className }: SelectProps) => {
  return (
    <label>
      {label}
      <select value={value} onChange={onChange} className={className}>
        {options.map((option) => (
          <option key={option.label} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
};