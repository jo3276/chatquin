import React, { useState } from 'react';
import { Icon } from './Icon';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-bg-secondary p-6 rounded-lg shadow-xl max-w-md w-full border border-border-primary">
        <h2 className="text-xl font-bold text-text-primary mb-2">Enter Gemini API Key</h2>
        <p className="text-text-secondary text-sm mb-4">
          To use this application, please provide your Google Gemini API key. It will be stored securely in your browser's local storage and will not be shared.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API Key here..."
            className="w-full bg-bg-primary border border-border-secondary rounded-lg py-2.5 px-4 text-text-primary placeholder-text-placeholder focus:ring-2 focus:ring-accent-focus focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full mt-4 bg-accent-secondary hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
          >
            Save &amp; Continue
          </button>
        </form>
        <p className="text-xs text-text-tertiary mt-3 text-center">
          Don't have a key? Get one from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">Google AI Studio</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
