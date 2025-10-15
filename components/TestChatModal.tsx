import React, { useEffect } from 'react';
import type { ThemeConfig, FontSettings } from '../types';
import { Icon } from './Icon';
import { applyTheme } from '../themes';

interface TestChatModalProps {
  theme: ThemeConfig;
  fontSettings: FontSettings;
  onClose: () => void;
}

const TestChatModal: React.FC<TestChatModalProps> = ({ theme, fontSettings, onClose }) => {
  useEffect(() => {
    const previewRoot = document.getElementById('test-chat-modal-root');
    if (previewRoot) {
      applyTheme(theme, fontSettings, previewRoot);
    }
  }, [theme, fontSettings]);

  const botName = "Theme Bot";
  const greeting = `This is a test of the '${theme.name}' theme. Looks pretty good, don't you think? ✨`;
  const userMessage = "Wow, this looks amazing!";

  return (
    <div 
        className="fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
    >
      <div 
        id="test-chat-modal-root" 
        className="w-full max-w-sm h-[600px] max-h-[80vh] bg-bg-primary rounded-2xl border border-border-primary flex flex-col overflow-hidden shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex-shrink-0 p-3 bg-bg-secondary border-b border-border-primary flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 flex-shrink-0 bg-accent-primary rounded-full flex items-center justify-center">
                    <Icon name="bot" className="w-5 h-5 text-text-on-accent" />
                </div>
                <div>
                    <h2 className="font-bold text-text-primary truncate" style={{ fontWeight: 'var(--font-weight-bold)' }}>{botName}</h2>
                    <p className="text-xs text-text-secondary">Live Test</p>
                </div>
            </div>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors">
              <Icon name="close" className="w-5 h-5 text-text-secondary" />
            </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 flex-shrink-0 bg-accent-primary rounded-full flex items-center justify-center">
                <Icon name="bot" className="w-5 h-5 text-text-on-accent" />
            </div>
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl break-words bg-bg-secondary text-text-primary rounded-bl-none">
                <p className="whitespace-pre-wrap">{greeting}</p>
            </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl break-words bg-accent-primary text-text-on-accent rounded-br-none">
                    <p className="whitespace-pre-wrap">{userMessage}</p>
                </div>
                <div className="w-8 h-8 flex-shrink-0 bg-bg-tertiary rounded-full flex items-center justify-center">
                    <Icon name="user" className="w-5 h-5 text-text-secondary" />
                </div>
            </div>
             <div className="flex items-start gap-3 justify-start">
                 <div className="w-8 h-8 flex-shrink-0 bg-accent-primary rounded-full flex items-center justify-center">
                    <Icon name="bot" className="w-5 h-5 text-text-on-accent" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-bg-secondary rounded-bl-none">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-400"></span>
                    </div>
                </div>
            </div>
        </div>

        {/* Input Area */}
        <div className="p-2 bg-bg-secondary border-t border-border-primary">
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Testing mode is disabled"
                className="w-full bg-bg-tertiary border-transparent rounded-full py-2.5 px-4 text-text-secondary placeholder-text-placeholder focus:outline-none cursor-not-allowed"
                disabled
            />
            <button
                type="submit"
                disabled
                className="w-10 h-10 flex-shrink-0 bg-bg-interactive rounded-full flex items-center justify-center cursor-not-allowed"
                aria-label="Send message"
            >
                <Icon name="send" className="w-5 h-5 text-text-secondary" />
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TestChatModal;