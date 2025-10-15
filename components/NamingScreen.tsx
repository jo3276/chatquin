import React, { useState } from 'react';
import ChatPreview from './ChatPreview';
import type { SavedChatbot } from '../types';

interface NamingScreenProps {
  onConfirm: (name: string, knowledgeScope: 'strict' | 'general', persona: string) => void;
}

const NamingScreen: React.FC<NamingScreenProps> = ({ onConfirm }) => {
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [knowledgeScope, setKnowledgeScope] = useState<SavedChatbot['knowledgeScope']>('strict');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), knowledgeScope, persona.trim());
    }
  };

  const scopeDescription = knowledgeScope === 'strict'
    ? 'It will only answer questions based on the document you provided.'
    : 'It will answer from the document, but can use its general knowledge if needed.';

  return (
    <div className="h-full flex flex-col">
      {/* Main content area with two-column layout on medium screens and up */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-4 md:p-8 overflow-y-auto">
        
        {/* Left Column: Form Controls */}
        <div className="flex flex-col justify-center">
            <div className="max-w-md mx-auto md:mx-0">
                <div className="text-center md:text-left mb-8">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Almost there!</h2>
                    <p className="text-text-tertiary">{scopeDescription}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div>
                    <label htmlFor="chatbotName" className="text-left block text-sm font-medium text-text-secondary mb-2">Chatbot Name</label>
                    <input
                        id="chatbotName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., 'Project Docs Bot'"
                        className="w-full p-4 bg-bg-primary border border-border-primary rounded-lg text-text-secondary placeholder-text-placeholder focus:ring-2 focus:ring-accent-focus focus:outline-none"
                        autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="chatbotPersona" className="text-left block text-sm font-medium text-text-secondary mb-2">Chatbot Persona (Optional)</label>
                    <textarea
                        id="chatbotPersona"
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                        placeholder="e.g., A witty expert on ancient history."
                        className="w-full p-3 bg-bg-primary border border-border-primary rounded-lg text-text-secondary placeholder-text-placeholder focus:ring-2 focus:ring-accent-focus focus:outline-none resize-none"
                        rows={3}
                    />
                  </div>
                   <div>
                    <label className="text-left block text-sm font-medium text-text-secondary mb-2">Knowledge Scope</label>
                    <div className="flex bg-bg-primary rounded-lg p-1 border border-border-primary">
                      <button
                        type="button"
                        onClick={() => setKnowledgeScope('strict')}
                        className={`flex-1 text-center text-sm font-semibold p-2 rounded-md transition-colors ${knowledgeScope === 'strict' ? 'bg-accent-secondary text-white' : 'text-text-tertiary hover:bg-bg-tertiary/50'}`}
                      >
                        Strict
                      </button>
                      <button
                        type="button"
                        onClick={() => setKnowledgeScope('general')}
                        className={`flex-1 text-center text-sm font-semibold p-2 rounded-md transition-colors ${knowledgeScope === 'general' ? 'bg-accent-secondary text-white' : 'text-text-tertiary hover:bg-bg-tertiary/50'}`}
                      >
                        General
                      </button>
                    </div>
                  </div>
                </form>
            </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="hidden md:flex flex-col items-center justify-center">
            <ChatPreview name={name} knowledgeScope={knowledgeScope} />
        </div>

      </div>
       <div className="p-4 border-t border-border-primary bg-bg-secondary flex-shrink-0">
         <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full bg-accent-secondary hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Create & Start Chatting
        </button>
       </div>
    </div>
  );
};

export default NamingScreen;