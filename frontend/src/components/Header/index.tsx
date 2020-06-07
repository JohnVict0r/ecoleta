import React from 'react';

import logo from '../../assets/logo.svg';

interface Header {
  children?: object;
}

export default function Header({ children }: Header) {
  return (
    <header>
      <img src={logo} alt="Ecoleta" />
      {children && children}
    </header>
  );
}
