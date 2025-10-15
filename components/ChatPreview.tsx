
import React from 'react';
import { Icon } from './Icon';

interface ChatPreviewProps {
  name: string;
  knowledgeScope: 'strict' | 'general';
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ name, knowledgeScope }) => {
  const botName = name.trim() || 'Your Assistant';
  const greeting = `Hello there! I'm ${botName}, your friendly guide for this document. ✨ I'm all set to answer your questions. What's on your mind? 😊`;

  return (
    <div className="bg-bg-primary/50 rounded-2xl border border-border-primary/50 flex flex-col h-[600px] max-h-[80vh] overflow-hidden shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex-shrink-0 p-3 bg-bg-secondary border-b border-border-primary/50 flex items-center gap-4">
        <div className="w-8 h-8 flex-shrink-0 bg-accent-secondary rounded-full flex items-center justify-center">
          <Icon name="bot" className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-text-primary truncate">{botName}</h2>
            {knowledgeScope === 'general' && (
              <Icon name="brain" title="General Knowledge Enabled" className="w-4 h-4 text-accent-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-text-tertiary">Live Preview</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-start gap-3 justify-start">
          <div className="w-8 h-8 flex-shrink-0 bg-accent-secondary rounded-full flex items-center justify-center">
            <Icon name="bot" className="w-5 h-5 text-white" />
          </div>
          <div className="max-w-[80%] px-4 py-2.5 rounded-2xl break-words bg-bg-tertiary/50 text-text-secondary rounded-bl-none">
            <p className="whitespace-pre-wrap">{greeting}</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-2 bg-bg-secondary border-t border-border-primary">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-10 h-10 flex-shrink-0 bg-bg-tertiary rounded-full flex items-center justify-center cursor-not-allowed"
            aria-label="Toggle special actions"
            disabled
          >
            <Icon name="plus" className="w-5 h-5 text-text-placeholder" />
          </button>
          <input
            type="text"
            placeholder="Ask a question..."
            className="w-full bg-bg-tertiary border-transparent rounded-full py-2.5 px-4 text-text-tertiary placeholder-text-placeholder focus:outline-none cursor-not-allowed"
            disabled
          />
          <button
            type="submit"
            disabled
            className="w-10 h-10 flex-shrink-0 bg-bg-interactive rounded-full flex items-center justify-center cursor-not-allowed"
            aria-label="Send message"
          >
            <Icon name="send" className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;