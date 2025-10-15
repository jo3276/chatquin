import React, { useState } from 'react';
import type { SavedChatbot } from '../types';

interface EditBotScreenProps {
  chatbot: SavedChatbot;
  onSave: (id: string, updates: Partial<SavedChatbot>) => void;
}

const EditBotScreen: React.FC<EditBotScreenProps> = ({ chatbot, onSave }) => {
  const [name, setName] = useState(chatbot.name);
  const [persona, setPersona] = useState(chatbot.persona || '');
  const [knowledgeScope, setKnowledgeScope] = useState<SavedChatbot['knowledgeScope']>(chatbot.knowledgeScope);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(chatbot.id, {
        name: name.trim(),
        persona: persona.trim(),
        knowledgeScope,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Edit Chatbot</h2>
                <p className="text-text-tertiary">Update the performance and personality of your assistant.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="chatbotPersona" className="text-left block text-sm font-medium text-text-secondary mb-2">Chatbot Persona</label>
                <textarea
                    id="chatbotPersona"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    placeholder="e.g., 'A witty expert on ancient history.'"
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
                <p className="text-xs text-text-placeholder mt-2 pl-1">
                    {knowledgeScope === 'strict' ? 'Answers strictly from the document.' : 'Can use general knowledge as a fallback.'}
                </p>
            </div>
            </form>
        </div>
      </div>
       <div className="p-4 border-t border-border-primary bg-bg-secondary flex-shrink-0">
         <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full bg-accent-secondary hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Save Changes
        </button>
       </div>
    </div>
  );
};

export default EditBotScreen;