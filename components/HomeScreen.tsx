import React from 'react';
import type { SavedChatbot, ThemeConfig } from '../types';
import { Icon } from './Icon';

interface HomeScreenProps {
  chatbots: SavedChatbot[];
  onNewChatbot: () => void;
  onSelectChatbot: (id: string) => void;
  onViewSource: (id: string) => void;
  onEditChatbot: (id: string) => void;
  onDeleteChatbot: (id: string) => void;
  onInstallApp: () => void;
  showInstallButton: boolean;
  onOpenThemeStudio: () => void;
}

const DailyInsightCard: React.FC = () => (
    <div className="p-4 rounded-lg bg-bg-secondary/50 border border-border-primary flex items-start gap-4">
        <div className="w-8 h-8 flex-shrink-0 bg-yellow-500/20 text-yellow-300 rounded-lg flex items-center justify-center">
            <Icon name="star" className="w-5 h-5"/>
        </div>
        <div>
            <h4 className="font-bold text-text-primary">Daily Insight</h4>
            <p className="text-sm text-text-tertiary mt-1">"The best way to predict the future is to create it." - Let's build something amazing today!</p>
        </div>
    </div>
);

const ActionButton: React.FC<{icon: string, title: string, onClick: (e: React.MouseEvent) => void, className?: string}> = ({ icon, title, onClick, className }) => (
    <button onClick={onClick} title={title} className={`p-2 rounded-full text-text-tertiary hover:bg-bg-interactive/50 hover:text-text-primary transition-colors ${className}`}>
        <Icon name={icon} className="w-4 h-4" />
    </button>
);

const ChatbotCard: React.FC<{ 
    chatbot: SavedChatbot;
    onSelect: () => void;
    onViewSource: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ chatbot, onSelect, onViewSource, onEdit, onDelete }) => {
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
    
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    const getIconForSourceType = (sourceType?: string): React.ComponentProps<typeof Icon>['name'] => {
        switch (sourceType) {
            case 'image':
                return 'image';
            case 'text':
                return 'text';
            case 'file':
                return 'file';
            case 'link':
                return 'link';
            default:
                return 'bot';
        }
    }

    return (
        <div onClick={onSelect} className="flex items-center gap-4 bg-bg-secondary/50 hover:bg-bg-tertiary/50 p-3 rounded-lg cursor-pointer transition-colors">
            <div className="w-10 h-10 flex-shrink-0 bg-accent-primary/20 text-accent-primary rounded-lg flex items-center justify-center">
                <Icon name={getIconForSourceType(chatbot.sourceType)} className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                 <p className="font-bold text-text-primary truncate">{chatbot.name}</p>
                <p className="text-xs text-text-tertiary">Created {timeAgo(chatbot.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <ActionButton icon="eye" title="View Source" onClick={(e) => { stopPropagation(e); onViewSource(); }} />
                <ActionButton icon="edit" title="Edit" onClick={(e) => { stopPropagation(e); onEdit(); }} />
                <ActionButton icon="trash" title="Delete" onClick={(e) => { stopPropagation(e); onDelete(); }} className="hover:!text-red-500" />
            </div>
        </div>
    )
};

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  const { chatbots, onNewChatbot, onSelectChatbot, onViewSource, onEditChatbot, onDeleteChatbot, onInstallApp, showInstallButton, onOpenThemeStudio } = props;
  
  return (
    <div className="h-full flex flex-col">
        <div className="p-4 md:px-6 md:pt-6 md:pb-4 flex-shrink-0 text-left border-b border-border-primary flex justify-between items-start">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-text-primary">My Chatbots</h1>
                <p className="text-xs md:text-sm text-text-tertiary mt-1">Your personal collection of AI assistants</p>
            </div>
            <div className="flex flex-col items-end gap-3">
                 <button onClick={onOpenThemeStudio} className="flex items-center gap-2 text-xs font-semibold text-accent-primary bg-accent-secondary/30 hover:bg-accent-secondary/50 px-3 py-1.5 rounded-md">
                    <Icon name="wand" className="w-4 h-4" />
                    Customize
                 </button>
                 {showInstallButton && (
                    <button onClick={onInstallApp} className="flex items-center gap-2 text-xs font-semibold text-accent-primary bg-accent-secondary/30 hover:bg-accent-secondary/50 px-3 py-1.5 rounded-md">
                        <Icon name="download" className="w-4 h-4" />
                        Install App
                    </button>
                 )}
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <DailyInsightCard />
            {chatbots.length === 0 ? (
                <div className="text-center h-full flex flex-col items-center justify-center -mt-24">
                    <Icon name="bot" className="w-16 h-16 text-bg-interactive mb-4" />
                    <h3 className="font-semibold text-text-secondary">Welcome!</h3>
                    <p className="text-text-placeholder text-sm mt-1">You don't have any chatbots yet. <br/>Create one to get started.</p>
                     <button 
                        onClick={onNewChatbot}
                        className="mt-6 bg-accent-secondary hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        Create New Chatbot
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {[...chatbots].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(bot => (
                        <ChatbotCard 
                            key={bot.id} 
                            chatbot={bot} 
                            onSelect={() => onSelectChatbot(bot.id)} 
                            onViewSource={() => onViewSource(bot.id)}
                            onEdit={() => onEditChatbot(bot.id)}
                            onDelete={() => onDeleteChatbot(bot.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default HomeScreen;