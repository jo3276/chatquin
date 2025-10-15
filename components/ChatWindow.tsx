import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, SavedChatbot, QuizData, ChatMode } from '../types';
import { Icon } from './Icon';

interface ChatWindowProps {
  chatbot: SavedChatbot;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onSpecialAction: (action: 'summary' | 'quiz' | 'mindmap' | 'code') => void;
  activeMode: ChatMode | null;
  onViewMindMap: (mermaidCode: string) => void;
  onRegenerateResponse: () => void;
  isNarrationEnabled: boolean;
}

const QuizComponent: React.FC<{ quiz: QuizData; onNextQuestion: () => void }> = ({ quiz, onNextQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
  };

  const handleShowAnswer = () => {
    if (selectedAnswer === null) return;
    setShowAnswer(true);
  };

  const getButtonClass = (index: number) => {
    if (!showAnswer) {
      return selectedAnswer === index
        ? 'bg-accent-secondary border-accent-hover text-white'
        : 'bg-bg-secondary border-border-primary hover:border-accent-secondary text-text-secondary';
    }
    if (index === quiz.correctAnswerIndex) {
      return 'bg-emerald-600 border-emerald-500 text-white';
    }
    if (index === selectedAnswer && index !== quiz.correctAnswerIndex) {
      return 'bg-red-600 border-red-500 text-white';
    }
    return 'bg-bg-secondary border-border-primary opacity-60 text-text-tertiary';
  };

  return (
    <div className="space-y-4">
      <p className="font-bold text-text-primary whitespace-pre-wrap">{quiz.question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            disabled={showAnswer}
            className={`p-3 text-left rounded-lg border-2 transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(index)}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="text-center pt-2">
        <button
          onClick={handleShowAnswer}
          disabled={selectedAnswer === null || showAnswer}
          className="bg-bg-interactive hover:bg-bg-tertiary disabled:bg-bg-tertiary/50 disabled:text-text-placeholder disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          {showAnswer ? 'Answer Revealed' : 'View Answer'}
        </button>
      </div>
      {showAnswer && (
        <>
            <div className={`mt-4 p-3 rounded-lg animate-fadeIn ${selectedAnswer === quiz.correctAnswerIndex ? 'bg-emerald-900/50 border border-emerald-700' : 'bg-red-900/50 border border-red-700'}`}>
            <h4 className="font-bold">{selectedAnswer === quiz.correctAnswerIndex ? 'Correct! 🎉' : 'Not quite... 🤔'}</h4>
            <p className="text-sm mt-1 text-text-secondary whitespace-pre-wrap">{quiz.explanation}</p>
            </div>
            <div className="text-center mt-4">
                <button
                    onClick={onNextQuestion}
                    className="bg-accent-secondary hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Next Question
                </button>
            </div>
        </>
      )}
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chatbot, messages, onSendMessage, isLoading, onSpecialAction, activeMode, onViewMindMap, onRegenerateResponse, isNarrationEnabled }) => {
  const [input, setInput] = useState('');
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Narrate new bot messages
    if (isNarrationEnabled && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === 'bot' && lastMessage.id !== lastSpokenIdRef.current) {
            // Cancel any previous speech to avoid overlap
            window.speechSynthesis.cancel();
            
            // Speak the new message text, stripping any markdown for cleaner speech
            const textToSpeak = lastMessage.text.replace(/```mermaid[\s\S]*?```/g, 'A mind map has been generated.').replace(/(\*\*|`)/g, '');
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
            lastSpokenIdRef.current = lastMessage.id;
        }
    }
  }, [messages, isNarrationEnabled]);

  useEffect(() => {
    // This effect will run every time messages update to render any new Mermaid diagrams.
    setTimeout(() => {
      try {
        const mermaidElements = document.querySelectorAll('.mermaid:not([data-processed="true"])');
        if (mermaidElements.length > 0 && (window as any).mermaid) {
          (window as any).mermaid.run({
            nodes: mermaidElements,
          });
        }
      } catch (e) {
        console.error("Mermaid rendering failed:", e);
      }
    }, 100); // A small delay to ensure React has rendered the DOM
  }, [messages]);

  useEffect(() => {
    // Cleanup: stop any speech when the component unmounts
    return () => {
        window.speechSynthesis.cancel();
    };
  }, []);


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      setShowActions(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };
  
  const handleActionClick = (action: 'summary' | 'quiz' | 'mindmap' | 'code') => {
    onSpecialAction(action);
    setShowActions(false);
  }
  
  const renderMessageContent = (message: ChatMessage) => {
    if (message.quiz) {
      return (
        <div>
          <p className="whitespace-pre-wrap mb-4">{message.text}</p>
          <QuizComponent quiz={message.quiz} onNextQuestion={() => onSpecialAction('quiz')} />
        </div>
      );
    }
  
    const text = message.text;
  
    // 1. Check for image URL
    const imageRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/i;
    const imageMatch = text.match(imageRegex);
    if (imageMatch) {
      return <img src={imageMatch[0]} alt="Generated content" className="rounded-lg max-w-full h-auto" />;
    }
  
    // Function to render text with bolding
    const renderTextPart = (textPart: string, keyPrefix: string) => {
      const boldParts = textPart.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${keyPrefix}-${index}`} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };
  
    // 2. Check for Mermaid diagram
    const mermaidRegex = /```mermaid\n([\s\S]+?)\n```/g;
    const parts = text.split(mermaidRegex);
  
    if (parts.length > 1) {
      return (
        <div className="whitespace-pre-wrap">
          {parts.map((part, index) => {
            if (index % 2 === 1) { // Mermaid code
              return (
                <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => onViewMindMap(part)}
                >
                    <div className="mermaid p-4 bg-bg-primary/50 rounded-lg my-2">{part}</div>
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Icon name="eye" className="w-8 h-8 text-white" />
                        <span className="ml-2 text-white font-bold">View Larger</span>
                    </div>
                </div>
              );
            }
            return renderTextPart(part, `text-${index}`); // Regular text
          })}
        </div>
      );
    }
    
    // 3. Fallback to just text with bolding
    return (
      <p className="whitespace-pre-wrap">
        {renderTextPart(text, 'p')}
      </p>
    );
  };

  const ActionButton: React.FC<{
    action: 'summary' | 'quiz' | 'mindmap' | 'code';
    label: string;
    icon: React.ComponentProps<typeof Icon>['name'];
  }> = ({ action, label, icon }) => (
    <button
      onClick={() => handleActionClick(action)}
      disabled={isLoading}
      className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-accent-primary disabled:text-text-placeholder disabled:cursor-not-allowed transition-colors p-2 rounded-lg hover:bg-bg-tertiary/50 text-xs w-full"
      aria-label={label}
    >
      <Icon name={icon} className="w-6 h-6" />
      <span className="mt-1">{label}</span>
    </button>
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 group ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 flex-shrink-0 bg-accent-hover rounded-full flex items-center justify-center">
                <Icon name="bot" className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[calc(100%-100px)] md:max-w-[80%] px-4 py-2.5 rounded-2xl break-words shadow-md ${
                message.sender === 'user'
                  ? 'bg-accent-secondary text-white rounded-br-none'
                  : 'bg-bg-secondary text-text-primary rounded-bl-none'
              }`}
            >
              {message.sender === 'bot' ? renderMessageContent(message) : <p className="whitespace-pre-wrap">{message.text}</p>}
            </div>

            <div className={`flex-shrink-0 flex self-center items-center gap-0.5 transition-opacity ${message.sender === 'bot' ? 'opacity-0 group-hover:opacity-100' : 'w-8'}`}>
              {message.sender === 'bot' && (
                <>
                  <button onClick={() => handleCopy(message.text)} title="Copy" className="p-1.5 rounded-full text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
                    <Icon name="copy" className="w-4 h-4" />
                  </button>
                  {index === messages.length - 1 && !isLoading && (
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
        {isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === 'user' && (
            <div className="flex items-start gap-3 justify-start">
                 <div className="w-8 h-8 flex-shrink-0 bg-accent-hover rounded-full flex items-center justify-center">
                    <Icon name="bot" className="w-5 h-5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-bg-tertiary/50 rounded-bl-none">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-text-tertiary rounded-full animate-pulse delay-400"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 bg-bg-secondary border-t border-border-primary">
        {showActions && (
            <div className="grid grid-cols-4 gap-2 p-4 bg-bg-primary/50 rounded-t-lg">
                <ActionButton action="summary" label="Summarize" icon="summary" />
                <ActionButton action="quiz" label="Quiz Me" icon="quiz" />
                <ActionButton action="mindmap" label="Mind Map" icon="mindmap" />
                <ActionButton action="code" label="Code/Algo" icon="code" />
            </div>
        )}
        <form onSubmit={handleSend} className="flex items-center gap-2">
           <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className="w-10 h-10 flex-shrink-0 bg-bg-tertiary rounded-full flex items-center justify-center hover:bg-bg-interactive transition-colors"
            aria-label="Toggle special actions"
          >
            <Icon name={showActions ? "close" : "plus"} className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="relative flex-1">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="w-full bg-bg-tertiary border-transparent rounded-full py-2.5 pl-4 pr-4 text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-accent-focus focus:outline-none"
                disabled={isLoading}
            />
           </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 flex-shrink-0 bg-accent-secondary rounded-full flex items-center justify-center hover:bg-accent-hover disabled:bg-bg-interactive disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Icon name="send" className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;