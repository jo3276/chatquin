import React, { useState, useEffect } from 'react';
import type { SavedChatbot } from '../types';

interface ViewSourceScreenProps {
  chatbot: SavedChatbot;
  onSave: (id: string, updates: Partial<SavedChatbot>) => void;
}

const ViewSourceScreen: React.FC<ViewSourceScreenProps> = ({ chatbot, onSave }) => {
  const [editedText, setEditedText] = useState(chatbot.contextText);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setEditedText(chatbot.contextText);
  }, [chatbot.contextText]);

  const handleSave = () => {
    if (canSave) {
      onSave(chatbot.id, { contextText: editedText.trim() });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const hasChanges = editedText.trim() !== chatbot.contextText.trim();
  const isTooShort = editedText.trim().length < 20;
  const canSave = hasChanges && !isTooShort;

  return (
    <div className="h-full flex flex-col">
        <div className="p-4 md:p-6 flex-shrink-0">
            <h2 className="text-xl font-bold text-text-primary mb-2">Knowledge Source</h2>
            <p className="text-sm text-text-tertiary mb-4">
                This is the information <span className="font-semibold text-text-secondary">{chatbot.name}</span> uses to answer questions.
            </p>
            {chatbot.summary && (
              <div className="mb-4">
                  <h3 className="text-lg font-semibold text-text-secondary mb-2">AI Summary</h3>
                  <div className="p-4 bg-bg-primary border border-border-primary rounded-lg text-text-secondary text-sm">
                      {chatbot.summary}
                  </div>
              </div>
            )}
        </div>

      <div className="flex-1 flex flex-col min-h-0 px-4 md:px-6 pb-4">
         <h3 className="text-lg font-semibold text-text-secondary mb-2 flex-shrink-0">Full Extracted Text</h3>
        <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full flex-1 p-4 bg-bg-primary border border-border-primary rounded-lg text-text-secondary placeholder-text-placeholder focus:ring-2 focus:ring-accent-focus focus:outline-none resize-none"
            aria-label="Chatbot source text"
        />
         {isTooShort && (
            <p className="text-xs text-red-400 mt-2">The text must be at least 20 characters long to save.</p>
        )}
      </div>

       <div className="p-4 border-t border-border-primary bg-bg-secondary flex-shrink-0">
         <button
          onClick={handleSave}
          disabled={!canSave || isSaved}
          className="w-full bg-accent-secondary hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
       </div>
    </div>
  );
};

export default ViewSourceScreen;