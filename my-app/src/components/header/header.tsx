import React from 'react';
import './header.css';

const HeaderElem: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img
          src="../../assets/logo.jpg"
          alt="Accessly logo"
          className="logo-image"
        />
        <div className="title">Accessly</div>
      </div>
      <nav className="header-nav">
        <a href="#about">About</a>
        <span className="dot">•</span>
        <a href="#support">Support</a>
      </nav>
    </header>
  );
};

export default HeaderElem;
