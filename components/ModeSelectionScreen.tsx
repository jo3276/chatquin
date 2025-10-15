import React from 'react';
import type { ChatMode } from '../types';
import { Icon } from './Icon';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: ChatMode) => void;
}

const ModeCard: React.FC<{
  mode: ChatMode;
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  description: string;
  onClick: (mode: ChatMode) => void;
}> = ({ mode, icon, title, description, onClick }) => (
  <button
    onClick={() => onClick(mode)}
    className="bg-bg-secondary/50 hover:bg-bg-tertiary/50 border border-border-primary rounded-lg p-6 text-left w-full transition-all duration-300 hover:border-accent-focus hover:shadow-lg hover:shadow-accent-hover/10"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex-shrink-0 bg-bg-tertiary rounded-lg flex items-center justify-center">
        <Icon name={icon} className="w-7 h-7 text-accent-primary" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <p className="text-sm text-text-tertiary mt-1">{description}</p>
      </div>
    </div>
  </button>
);

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Choose Interaction Mode</h2>
        <p className="text-text-tertiary mt-1">How would you like to engage with this chatbot?</p>
      </div>
      <div className="max-w-md w-full space-y-4">
        <ModeCard
          mode="chat"
          icon="message-circle"
          title="Visionary Chat"
          description="Have a standard, open-ended conversation."
          onClick={onModeSelect}
        />
        <ModeCard
          mode="quiz"
          icon="quiz"
          title="MCQ Quiz"
          description="Test your knowledge with continuous questions."
          onClick={onModeSelect}
        />
        <ModeCard
          mode="summary"
          icon="summary"
          title="Get Summary"
          description="Receive a concise summary of the document."
          onClick={onModeSelect}
        />
        <ModeCard
          mode="mindmap"
          icon="mindmap"
          title="Generate Mind Map"
          description="Visualize the key concepts in a connected graph."
          onClick={onModeSelect}
        />
      </div>
    </div>
  );
};

export default ModeSelectionScreen;