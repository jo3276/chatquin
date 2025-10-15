import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, ChatPersonality, GeneralChatSession } from '../types';
import { Icon } from './Icon';

interface GeneralChatScreenProps {
  sessions: GeneralChatSession[];
  activeSession: GeneralChatSession | undefined;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onSetPersonality: (sessionId: string, personality: ChatPersonality) => void;
  onRegenerateResponse: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isNarrationEnabled: boolean;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
}

const GeneralChatHistory: React.FC<{
    sessions: GeneralChatSession[];
    activeSessionId: string | null;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onClose: () => void;
}> = ({ sessions, activeSessionId, onSelectChat, onDeleteChat, onClose }) => {
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="flex flex-col h-full bg-bg-secondary border-r border-border-primary">
            <div className="p-3 flex-shrink-0 flex items-center justify-between border-b border-border-primary">
                <h2 className="font-bold text-text-primary text-lg">Chat History</h2>
                <button onClick={onClose} title="Close History" className="p-2 rounded-full hover:bg-bg-tertiary">
                    <Icon name="back" className="w-5 h-5 text-text-secondary"/>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {sortedSessions.length === 0 ? (
                    <p className="text-center text-text-tertiary p-4 text-sm">No chats yet.</p>
                ) : (
                    <ul className="p-2 space-y-1">
                        {sortedSessions.map(session => (
                            <li key={session.id}>
                                <button onClick={() => onSelectChat(session.id)} className={`w-full text-left p-2.5 rounded-lg group flex items-start gap-3 transition-colors ${activeSessionId === session.id ? 'bg-accent-secondary/30' : 'hover:bg-bg-tertiary'}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm truncate ${activeSessionId === session.id ? 'text-accent-primary' : 'text-text-primary'}`}>{session.title}</p>
                                        <p className="text-xs text-text-tertiary mt-1">{timeAgo(session.createdAt)}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteChat(session.id); }} 
                                        title="Delete chat" 
                                        className="p-1.5 rounded-full text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-red-900/50 hover:text-red-400"
                                    >
                                        <Icon name="trash" className="w-4 h-4" />
                                    </button>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


const PersonalitySwitcher: React.FC<{
    activePersonality: ChatPersonality;
    onChange: (p: ChatPersonality) => void;
}> = ({ activePersonality, onChange }) => {
    const personalities: { id: ChatPersonality; label: string }[] = [
        { id: 'professional', label: 'Professional' },
        { id: 'friend', label: 'Friend' },
        { id: 'lover', label: 'Lover' },
        { id: 'logic', label: 'Logic' },
        { id: 'genz', label: 'Genz' },
    ];

    return (
        <div className="flex items-center justify-center gap-2 p-1 bg-bg-secondary/60 rounded-full mt-3 flex-wrap">
            {personalities.map(p => (
                <button
                    key={p.id}
                    onClick={() => onChange(p.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                        activePersonality === p.id 
                        ? 'bg-accent-secondary text-white' 
                        : 'text-text-secondary hover:bg-bg-tertiary'
                    }`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    )
}

const GeneralChatScreen: React.FC<GeneralChatScreenProps> = ({ sessions, activeSession, onSendMessage, isLoading, onSetPersonality, onRegenerateResponse, onNewChat, onSelectChat, onDeleteChat, isNarrationEnabled }) => {
  const [input, setInput] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  useEffect(() => {
    // Narrate new bot messages
    if (isNarrationEnabled && activeSession && activeSession.messages.length > 0) {
      const lastMessage = activeSession.messages[activeSession.messages.length - 1];
      if (lastMessage.sender === 'bot' && lastMessage.id !== lastSpokenIdRef.current) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);
        window.speechSynthesis.speak(utterance);
        lastSpokenIdRef.current = lastMessage.id;
      }
    }
  }, [activeSession?.messages, isNarrationEnabled]);
  
  useEffect(() => {
    // Cleanup: stop any speech when the active session changes or component unmounts
    return () => {
        window.speechSynthesis.cancel();
        // Reset spoken message tracking when session changes
        lastSpokenIdRef.current = null;
    };
  }, [activeSession?.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="relative flex h-full overflow-hidden">
        <div className={`absolute lg:relative top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72 flex-shrink-0`}>
            <GeneralChatHistory 
                sessions={sessions} 
                activeSessionId={activeSession?.id || null} 
                onSelectChat={(id) => {
                    onSelectChat(id);
                    setIsHistoryOpen(false);
                }} 
                onDeleteChat={onDeleteChat}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
        
        {isHistoryOpen && (
            <div onClick={() => setIsHistoryOpen(false)} className="absolute inset-0 bg-black/50 z-20 lg:hidden" />
        )}

        <div className="flex flex-col h-full flex-1 pb-16">
          <div className="p-3 md:px-4 flex-shrink-0 text-left border-b border-border-primary">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsHistoryOpen(true)} title="Open History" className="p-2 rounded-full hover:bg-bg-tertiary lg:hidden">
                        <Icon name="collection" className="w-5 h-5 text-text-secondary"/>
                    </button>
                    <Icon name="brain" className="w-6 h-6 text-accent-primary hidden sm:block" />
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-text-primary">Chat with Chatquin</h1>
                        <p className="text-xs text-text-tertiary mt-0.5">Your general-purpose AI assistant</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <button onClick={onNewChat} title="New Chat" className="p-2 rounded-full hover:bg-bg-tertiary">
                        <Icon name="edit" className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>
            </div>
            {activeSession && <PersonalitySwitcher activePersonality={activeSession.personality} onChange={(p) => onSetPersonality(activeSession.id, p)} />}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeSession?.messages.map((message, index) => (
               <div
                key={message.id}
                className={`flex items-start gap-3 group ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 flex-shrink-0 bg-accent-secondary rounded-full flex items-center justify-center">
                    <Icon name="brain" className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[calc(100%-100px)] md:max-w-[80%] px-4 py-2.5 rounded-2xl break-words shadow-md ${
                    message.sender === 'user'
                      ? 'bg-accent-secondary text-white rounded-br-none'
                      : 'bg-bg-secondary text-text-primary rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                
                <div className={`flex-shrink-0 flex self-center items-center gap-0.5 transition-opacity ${message.sender === 'bot' ? 'opacity-0 group-hover:opacity-100' : 'w-8'}`}>
                    {message.sender === 'bot' && (
                        <>
                            <button onClick={() => handleCopy(message.text)} title="Copy" className="p-1.5 rounded-full text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
                                <Icon name="copy" className="w-4 h-4" />
                            </button>
                            {index === activeSession.messages.length - 1 && !isLoading && (
                                <button onClick={onRegenerateResponse} title="Regenerate response" className="p-1.5 rounded-full text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
                                <Icon name="refresh" className="w-4 h-4" />
                                </button>
                            )}
                        </>
                    )}
                    {message.sender === 'user' && (
                        <div className="w-8 h-8 flex-shrink-0 bg-bg-interactive rounded-full flex items-center justify-center">
                            <Icon name="user" className="w-5 h-5 text-text-secondary" />
                        </div>
                    )}
                </div>
              </div>
            ))}
            {isLoading && activeSession?.messages[activeSession.messages.length - 1]?.sender === 'user' && (
                <div className="flex items-start gap-3 justify-start">
                     <div className="w-8 h-8 flex-shrink-0 bg-accent-secondary rounded-full flex items-center justify-center">
                        <Icon name="brain" className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-bg-secondary/50 rounded-bl-none">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse delay-0"></span>
                            <span className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse delay-200"></span>
                            <span className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse delay-400"></span>
                        </div>
                    </div>
                </div>
            )}
            {!activeSession && (
                <div className="flex items-center justify-center h-full text-text-tertiary">
                    <p>Select a chat to begin.</p>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-2 bg-bg-secondary border-t border-border-primary">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-bg-tertiary border-transparent rounded-full py-2.5 pl-4 pr-12 text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-accent-focus focus:outline-none"
                    disabled={isLoading || !activeSession}
                />
               </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !activeSession}
                className="w-10 h-10 flex-shrink-0 bg-accent-secondary rounded-full flex items-center justify-center hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Icon name="send" className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>
    </div>
  );
};

export default GeneralChatScreen;