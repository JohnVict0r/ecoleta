import React from 'react';

interface FieldInput {
  name: string;
  label: string;
  instructions: string;
  data: string[];
  value: string;
  handleChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export default function FieldSelect({
  name,
  label,
  instructions,
  data,
  value,
  handleChange,
}: FieldInput) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} value={value} onChange={handleChange}>
        <option value="0">{instructions}</option>

        {data.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
