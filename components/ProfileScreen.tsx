import React from 'react';
import { Icon } from './Icon';

const ProfileScreen: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
      <Icon name="user-circle" className="w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-slate-300">My Profile</h2>
      <p className="mt-2 max-w-xs">
        Manage your account settings, preferences, and subscription plan here. Coming soon!
      </p>
    </div>
  );
};

export default ProfileScreen;
