import React, { useState, useEffect } from 'react';
import type { ThemeConfig, FontSettings } from '../types';
import { Icon } from './Icon';
import { themeCategories, applyTheme, defaultTheme } from '../themes';
import TestChatModal from './TestChatModal';

interface ThemeStudioModalProps {
    currentTheme: ThemeConfig;
    currentFontSettings: FontSettings;
    onClose: () => void;
    onSave: (theme: ThemeConfig, fontSettings: FontSettings) => void;
    isNarrationEnabled: boolean;
    onToggleNarration: (enabled: boolean) => void;
}

const LivePreview: React.FC<{ theme: ThemeConfig; fontSettings: FontSettings }> = ({ theme, fontSettings }) => {
    useEffect(() => {
        const previewRoot = document.getElementById('theme-preview-root');
        if (previewRoot) {
            applyTheme(theme, fontSettings, previewRoot);
        }
    }, [theme, fontSettings]);

    return (
        <div id="theme-preview-root" className="w-full h-full p-4 md:p-6 bg-bg-primary rounded-lg border border-border-primary overflow-hidden">
            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-bg-secondary p-3 rounded-lg">
                    <div className="w-8 h-8 flex-shrink-0 bg-accent-primary/20 text-accent-primary rounded-lg flex items-center justify-center">
                        <Icon name="bot" className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-primary truncate" style={{ fontWeight: 'var(--font-weight-bold)' }}>Preview Bot</p>
                        <p className="text-xs text-text-secondary">Just now</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 justify-start">
                    <div className="w-7 h-7 flex-shrink-0 bg-accent-primary rounded-full flex items-center justify-center">
                         <Icon name="bot" className="w-4 h-4 text-text-on-accent" />
                    </div>
                    <div className="max-w-[80%] px-3 py-2 text-sm rounded-2xl bg-bg-secondary text-text-primary rounded-bl-none">
                        <p>This is how I'll look!</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-[80%] px-3 py-2 text-sm rounded-2xl bg-accent-primary text-text-on-accent rounded-br-none">
                        <p>And this is you.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 bg-accent-primary hover:bg-accent-secondary text-text-on-accent font-bold py-2 px-4 rounded-lg transition-colors" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                        Primary Action
                    </button>
                     <button className="flex-1 bg-bg-tertiary hover:bg-bg-secondary text-text-primary font-bold py-2 px-4 rounded-lg transition-colors" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                        Secondary
                    </button>
                </div>
            </div>
        </div>
    )
}

const ControlWrapper: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-3" style={{ fontWeight: 'var(--font-weight-bold)' }}>{label}</label>
        {children}
    </div>
);

const PrivacyModal: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-bg-secondary/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
        <div className="bg-bg-primary border border-border-primary rounded-lg shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text-primary">Privacy Policy</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-bg-tertiary">
                    <Icon name="close" className="w-5 h-5 text-text-secondary" />
                </button>
            </div>
            <div className="text-sm text-text-secondary space-y-3 max-h-80 overflow-y-auto pr-2">
                <p>We take your privacy seriously. This app is designed to be self-contained on your device.</p>
                <p><strong className="text-text-primary">Data Storage:</strong> All chatbot data, including the knowledge sources you provide and your chat history, is stored exclusively in your browser's local storage. This data does not leave your device and is not sent to any of our servers.</p>
                <p><strong className="text-text-primary">API Key:</strong> This app requires a Google Gemini API key to function. The key is stored only in your browser's local storage. It is required to make direct calls from your browser to the Google Gemini API. We do not see, store, or transmit your API key.</p>
                <p><strong className="text-text-primary">Third-Party Services:</strong> The app communicates directly with the Google Gemini API to provide its core functionality. Your interactions with the chatbots are subject to Google's own privacy policies and terms of service.</p>
                <p>By using this app, you acknowledge that your data is handled as described above.</p>
            </div>
        </div>
    </div>
);

const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({ currentTheme, currentFontSettings, onClose, onSave, isNarrationEnabled, onToggleNarration }) => {
    const [editedTheme, setEditedTheme] = useState<ThemeConfig>(currentTheme);
    const [fontSettings, setFontSettings] = useState<FontSettings>(currentFontSettings);
    const [isTesting, setIsTesting] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    const handleSelectPreset = (preset: ThemeConfig) => {
        setEditedTheme(preset);
        // If the preset has accessibility font settings, apply them
        if (preset.fontSettingsOverride) {
            setFontSettings(current => ({...current, ...preset.fontSettingsOverride}));
        }
    }

    const handleSave = () => {
        onSave(editedTheme, fontSettings);
        onClose();
    }
    
    const handleReset = () => {
        setEditedTheme(defaultTheme);
        setFontSettings({ size: 'sm', weight: 'normal' });
    }

    return (
    <>
    <div className="fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-sm flex flex-col p-2 md:p-4 animate-fadeIn">
      <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-2xl w-full h-full flex flex-col">
        <header className="flex-shrink-0 p-3 flex items-center justify-between border-b border-border-primary">
          <div className="flex items-center gap-2">
            <Icon name="wand" className="w-5 h-5 text-accent-primary" />
            <h2 className="font-bold text-lg text-text-primary">Theme Studio</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors">
            <Icon name="close" className="w-5 h-5 text-text-secondary" />
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-0">
            {/* Controls */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
                {/* Presets */}
                <ControlWrapper label="Appearance">
                    <div className="space-y-4">
                        {themeCategories.map(category => (
                            <div key={category.name}>
                                <h4 className="font-semibold text-text-tertiary text-xs uppercase tracking-wider mb-2">{category.name}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {category.themes.map(preset => (
                                        <button key={preset.name} onClick={() => handleSelectPreset(preset)} className={`p-2 rounded-lg border-2 transition-colors ${editedTheme.name === preset.name ? 'border-accent-primary bg-accent-primary/10' : 'border-border-primary hover:border-border-secondary bg-bg-tertiary/50'}`}>
                                            <div className="w-full h-8 rounded mb-1.5" style={{ backgroundColor: preset.colors.bgPrimary, border: `1px solid ${preset.colors.border}` }} >
                                                <div className="flex items-center justify-center h-full gap-1">
                                                     <div className="w-4 h-4 rounded-full" style={{backgroundColor: preset.colors.accentPrimary}}></div>
                                                     <div className="w-4 h-4 rounded-full" style={{backgroundColor: preset.colors.textPrimary}}></div>
                                                     <div className="w-4 h-4 rounded-full" style={{backgroundColor: preset.colors.textSecondary}}></div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-text-secondary block truncate">{preset.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ControlWrapper>

                {/* Accessibility & Readability */}
                 <ControlWrapper label="Accessibility & Readability">
                    <div className="space-y-4 p-3 bg-bg-primary/50 rounded-lg">
                        {/* Font Size */}
                        <div>
                            <label className="text-sm font-medium text-text-primary mb-2 block">Font Size</label>
                            <div className="flex items-center bg-bg-tertiary rounded-lg p-1">
                                {(['sm', 'base', 'lg'] as const).map(size => (
                                    <button key={size} onClick={() => setFontSettings(s => ({...s, size}))} className={`flex-1 text-center text-sm font-semibold p-2 rounded-md transition-colors ${fontSettings.size === size ? 'bg-accent-primary text-text-on-accent' : 'text-text-secondary hover:bg-bg-secondary'}`}>
                                        {size === 'sm' ? 'S' : size === 'base' ? 'M' : 'L'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Font Weight */}
                        <div className="flex items-center justify-between">
                            <label htmlFor="bolder-text-toggle" className="text-sm font-medium text-text-primary">Bolder Text</label>
                             <input 
                                id="bolder-text-toggle"
                                type="checkbox"
                                checked={fontSettings.weight === 'bold'}
                                onChange={e => setFontSettings(s => ({...s, weight: e.target.checked ? 'bold' : 'normal'}))}
                                className="toggle-checkbox"
                             />
                        </div>
                        {/* Voice Narration */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="microphone" className="w-4 h-4 text-text-primary" />
                                <label htmlFor="narration-toggle" className="text-sm font-medium text-text-primary">Voice Narration</label>
                            </div>
                            <input
                                id="narration-toggle"
                                type="checkbox"
                                checked={isNarrationEnabled}
                                onChange={e => onToggleNarration(e.target.checked)}
                                className="toggle-checkbox"
                            />
                        </div>
                    </div>
                 </ControlWrapper>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center justify-center bg-bg-primary/50 rounded-lg">
                <LivePreview theme={editedTheme} fontSettings={fontSettings} />
            </div>
        </div>

        <footer className="flex-shrink-0 p-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border-primary">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                 <button onClick={() => setIsTesting(true)} className="flex-1 sm:flex-none bg-bg-interactive hover:bg-bg-tertiary text-text-primary font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Icon name="eye" className="w-4 h-4" />
                    Test Theme
                </button>
                 <button onClick={handleReset} className="flex-1 sm:flex-none bg-bg-interactive hover:bg-bg-tertiary text-text-primary font-bold py-2 px-4 rounded-lg transition-colors">
                    Reset
                </button>
                 <button onClick={() => setIsPrivacyModalOpen(true)} className="text-xs text-text-tertiary hover:underline">
                    Privacy Policy
                </button>
            </div>
            <div className="w-full sm:w-auto">
                <button onClick={handleSave} className="w-full bg-accent-primary hover:bg-accent-secondary text-text-on-accent font-bold py-2 px-6 rounded-lg transition-colors">
                    Apply Theme
                </button>
            </div>
        </footer>
      </div>
    </div>
    {isTesting && (
        <TestChatModal theme={editedTheme} fontSettings={fontSettings} onClose={() => setIsTesting(false)} />
    )}
    {isPrivacyModalOpen && <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />}
    </>
  );
};

export default ThemeStudioModal;