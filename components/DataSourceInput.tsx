import React, { useState, useRef } from 'react';
import type { DataSourceType } from '../types';
import { Icon } from './Icon';

interface DataSourceInputProps {
  onImageUpload: (file: File) => void;
  onFileUpload: (file: File) => void;
  onTextSubmit: (text: string) => void;
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
  onVoiceCreate: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-bg-secondary/80 flex flex-col items-center justify-center z-20 rounded-lg">
      <Icon name="spinner" className="w-12 h-12 text-accent-primary animate-spin" />
      <p className="mt-4 text-text-secondary font-medium">Processing your data...</p>
      <p className="text-text-tertiary text-sm">This may take a moment.</p>
    </div>
);

const DataSourceInput: React.FC<DataSourceInputProps> = ({
  onImageUpload,
  onFileUpload,
  onTextSubmit,
  onUrlSubmit,
  isLoading,
  onVoiceCreate,
}) => {
  const [activeSection, setActiveSection] = useState<DataSourceType | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [url, setUrl] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleTextPasteSubmit = () => {
    if (pastedText.trim()) {
      onTextSubmit(pastedText);
    }
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onUrlSubmit(url);
    }
  };

  const handleSectionClick = (sectionId: DataSourceType) => {
    // Immediate actions for file uploads
    if (sectionId === 'image') {
      imageInputRef.current?.click();
      return;
    }
    if (sectionId === 'file') {
      fileInputRef.current?.click();
      return;
    }
    // Toggle collapsible sections
    setActiveSection(current => (current === sectionId ? null : sectionId));
  };
  
  const sections: { id: DataSourceType; name: string; icon: React.ComponentProps<typeof Icon>['name']; description: string; expandable: boolean }[] = [
    { id: 'text', name: 'Paste Text', icon: 'text', description: 'Provide raw text content.', expandable: true },
    { id: 'image', name: 'Upload Image', icon: 'image', description: 'Extract text from an image.', expandable: false },
    { id: 'file', name: 'Upload File', icon: 'file', description: '.txt and .md files.', expandable: false },
    { id: 'link', name: 'From Webpage', icon: 'link', description: 'Extract content from a URL.', expandable: true },
  ];

  return (
    <div className="relative h-full flex flex-col">
      {isLoading && <LoadingSpinner />}
      <div className="p-4 md:p-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Provide a Knowledge Source</h2>
        <p className="text-sm md:text-base text-text-tertiary">Choose a method to create your new chatbot.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 md:px-6 space-y-3 pb-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-accent-gradient-from/20 to-accent-gradient-to/20 border border-accent-secondary/50 flex flex-col items-center text-center">
            <Icon name="microphone" className="w-8 h-8 text-accent-primary mb-2" />
            <h3 className="font-bold text-text-primary">Create with Voice</h3>
            <p className="text-sm text-text-tertiary mt-1 mb-3 max-w-xs">Describe your chatbot's topic out loud, and we'll transcribe it for you.</p>
            <button
                onClick={onVoiceCreate}
                disabled={isLoading}
                className="bg-accent-secondary hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Start Speaking
            </button>
        </div>
        <div className="text-center text-xs text-text-tertiary my-2">OR CHOOSE ANOTHER METHOD</div>
        
        {sections.map(section => {
          const isActive = activeSection === section.id;
          return (
            <div key={section.id} className="bg-bg-secondary/50 rounded-lg border border-border-primary overflow-hidden transition-all duration-300">
              <button
                onClick={() => handleSectionClick(section.id)}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-tertiary/30 transition-colors disabled:cursor-not-allowed"
                aria-expanded={isActive}
              >
                <div className="flex items-center gap-4">
                  <Icon name={section.icon} className="w-6 h-6 text-accent-primary flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-text-primary">{section.name}</span>
                    <p className="text-xs text-text-tertiary">{section.description}</p>
                  </div>
                </div>
                {section.expandable && (
                  <Icon name="chevron-down" className={`w-5 h-5 text-text-tertiary transition-transform duration-300 flex-shrink-0 ${isActive ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {section.expandable && (
                <div className={`transition-all duration-300 ease-in-out grid ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      {section.id === 'text' && (
                          <div className="p-4 pt-2 space-y-3">
                              <textarea
                                  value={pastedText}
                                  onChange={(e) => setPastedText(e.target.value)}
                                  placeholder="Paste your text content here... (minimum 20 characters)"
                                  className="w-full h-40 p-3 bg-bg-primary border border-border-secondary rounded-md text-text-secondary placeholder-text-placeholder focus:ring-2 focus:ring-accent-focus focus:outline-none resize-none"
                              />
                              <button onClick={handleTextPasteSubmit} disabled={isLoading || pastedText.trim().length < 20} className="w-full bg-accent-secondary hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-md transition-colors">Create Chatbot from Text</button>
                          </div>
                      )}
                      {section.id === 'link' && (
                          <div className="p-4 pt-2 space-y-3">
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/article"
                                className="w-full p-3 bg-bg-primary border border-border-secondary rounded-md text-text-secondary placeholder-text-placeholder focus:ring-2 focus:ring-accent-focus focus:outline-none"
                              />
                              <button onClick={handleUrlSubmit} disabled={isLoading || !url.trim().startsWith('http')} className="w-full bg-accent-secondary hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-md transition-colors">Create Chatbot from Webpage</button>
                          </div>
                      )}
                    </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden file inputs remain for functionality */}
      <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
      <input type="file" accept=".txt,.md" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
};

export default DataSourceInput;