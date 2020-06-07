import React from 'react';

interface FieldSet {
  title: string;
  instructions?: string;
  children?: object;
}

export default function FieldSet({
  title,
  instructions,
  children = {},
}: FieldSet) {
  return (
    <fieldset>
      <legend>
        <h2>{title}</h2>
        {instructions && <span>{instructions}</span>}
      </legend>
      {children}
    </fieldset>
  );
}
