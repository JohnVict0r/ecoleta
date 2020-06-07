import React from 'react';

import logo from '../../assets/logo.svg';

export default function Header({ children = {} }) {
  return (
    <header>
      <img src={logo} alt="Ecoleta" />
      {children}
    </header>
  );
}
