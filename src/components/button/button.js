import { jsx as _jsx } from 'react/jsx-runtime';
import './button.css';
const Button = ({ onClick, disabled, children }) => {
  return _jsx('button', {
    className: 'export-button',
    onClick: onClick,
    disabled: disabled,
    children: children,
  });
};
export default Button;
