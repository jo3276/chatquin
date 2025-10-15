import React from 'react';
import { Icon } from './Icon';

const DiscoverScreen: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
      <Icon name="compass" className="w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-slate-300">Discover</h2>
      <p className="mt-2 max-w-xs">
        This is where you'll find featured chatbots, new AI capabilities, and community creations. Coming soon!
      </p>
    </div>
  );
};

export default DiscoverScreen;
