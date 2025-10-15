import React from 'react';
import { Icon } from './Icon';

type Screen = 'home' | 'chatList';

interface BottomNavBarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onCreateClick: () => void;
}

const NavItem: React.FC<{
  iconName: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ iconName, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${isActive ? 'text-accent-primary' : 'text-text-tertiary hover:text-text-primary'}`}
  >
    <div className="relative">
        <Icon name={iconName} className="w-6 h-6" />
        {isActive && <div className="absolute -inset-2 bg-accent-hover/20 rounded-full blur-md" />}
    </div>
    <span className="text-xs font-bold">{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, onNavigate, onCreateClick }) => {
  return (
    <nav 
        className="flex-shrink-0 h-16 bg-bg-secondary-alpha backdrop-blur-[var(--glass-blur)] border-t border-border-primary grid grid-cols-3 items-center"
    >
      <NavItem
        iconName="home"
        label="Home"
        isActive={activeScreen === 'home'}
        onClick={() => onNavigate('home')}
      />
      
      {/* Central Create Button */}
      <div className="flex justify-center items-center">
        <button 
            onClick={onCreateClick}
            className="w-16 h-16 -mt-8 bg-gradient-to-br from-accent-gradient-from to-accent-gradient-to rounded-full flex items-center justify-center shadow-lg shadow-accent-hover/30 transition-transform hover:scale-105"
            aria-label="Create new chatbot"
        >
          <Icon name="plus" className="w-8 h-8 text-white" />
        </button>
      </div>
      
       <NavItem
        iconName="message-circle"
        label="Chat"
        isActive={activeScreen === 'chatList'}
        onClick={() => onNavigate('chatList')}
      />
    </nav>
  );
};

export default BottomNavBar;