import React from 'react';
import './button.css';

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button className="export-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
