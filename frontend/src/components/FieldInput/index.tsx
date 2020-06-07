import React from 'react';

interface FieldInput {
  name: string;
  label: string;
  type: string;
  handleInputChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function FieldInput({
  name,
  label,
  type,
  handleInputChange,
}: FieldInput) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input type={type} name={name} id={name} onChange={handleInputChange} />
    </div>
  );
}
