import React, { useState } from 'react';
import './input.css';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className={`url-input ${isFocused ? 'url-input--focused' : ''}`}>
      <input
        className="url-input__field"
        type="text"
        placeholder="Введите URL веб-страницы..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="url-input__decor" />
    </div>
  );
};

export default UrlInput;
