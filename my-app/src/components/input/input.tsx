import React from 'react';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Введите URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '300px', marginRight: '0.5rem' }}
      />
    </div>
  );
};

export default UrlInput;