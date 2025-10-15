import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface ChatquinModalProps {
  onClose: () => void;
  onCreateBot: (text: string) => void;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

type Status = 'idle' | 'listening' | 'processing' | 'error';
type Permission = 'checking' | 'granted' | 'prompt' | 'denied';

const ChatquinModal: React.FC<ChatquinModalProps> = ({ onClose, onCreateBot }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [permission, setPermission] = useState<Permission>('checking');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  // Effect for setting up the speech recognition object once.
  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setStatus('processing');
        onCreateBot(transcript);
      } else {
        setError('Could not understand speech. Please try again.');
        setStatus('error');
      }
    };

    recognition.onerror = (event: any) => {
      let friendlyError = 'An unknown voice recognition error occurred.';
      if (event.error === 'audio-capture') {
        friendlyError = 'Could not capture audio. Please ensure your microphone is connected and not in use by another application.';
      } else if (event.error === 'not-allowed') {
        friendlyError = 'Microphone access was not allowed. Please grant permission in your browser settings.';
        setPermission('denied');
      } else if (event.error === 'no-speech') {
        friendlyError = 'No speech was detected. Please try speaking again.';
      }
      setError(friendlyError);
      setStatus('error');
    };

    recognition.onend = () => {
      // Use functional update to check the latest status.
      // If we are still in 'listening' state, it means the recognition timed out without a result.
      setStatus((currentStatus) => (currentStatus === 'listening' ? 'idle' : currentStatus));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCreateBot]);

  // Effect for checking and monitoring microphone permissions.
  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      setPermission('denied');
      setError('Voice recognition is not supported in this browser.');
      return;
    }

    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
        setPermission(permissionStatus.state);
        permissionStatus.onchange = () => {
          setPermission(permissionStatus.state);
        };
      });
    } else {
      // Fallback for browsers that don't support the Permissions API.
      // We will assume 'prompt' and let the browser handle it when we try to start.
      setPermission('prompt');
    }
  }, []);

  const handleListenClick = () => {
    if (status === 'listening' || status === 'processing' || !recognitionRef.current) return;
    
    if (permission === 'denied') {
        setError("Microphone access is denied. Please enable it in your browser settings.");
        setStatus('error');
        return;
    }

    setError(null);
    
    try {
        recognitionRef.current.start();
    } catch (e) {
        console.error("Error starting recognition:", e);
        setError("Could not start audio capture. The microphone might be unavailable.");
        setStatus('error');
    }
  };
  
  const getStatusContent = () => {
    let isError = false;

    if (permission === 'denied') {
        isError = true;
        return {
            title: "Microphone Access Denied",
            subtitle: "To use voice creation, please enable microphone access for this site in your browser's settings.",
            icon: 'microphone',
            iconClass: "text-red-400",
            buttonDisabled: true,
            isError,
        }
    }
    if (permission === 'prompt') {
        return {
            title: "Create with Voice",
            subtitle: "Tap the microphone to grant permission and start describing the topic for your chatbot.",
            icon: 'microphone',
            iconClass: "animate-pulse",
            buttonDisabled: false,
            isError,
        }
    }

    switch (status) {
      case 'listening':
        return {
          title: "Listening...",
          subtitle: "Start speaking to provide the knowledge for your chatbot.",
          icon: 'microphone',
          iconClass: "animate-pulse",
          buttonDisabled: true,
          isError,
        };
      case 'processing':
        return {
          title: "Processing...",
          subtitle: "Transcribing your voice into text to create your new assistant.",
          icon: 'spinner',
          iconClass: "animate-spin",
          buttonDisabled: true,
          isError,
        };
      case 'error':
        isError = true;
        return {
          title: "An Error Occurred",
          subtitle: error || "Something went wrong. Please try again.",
          icon: 'close',
          iconClass: "text-white",
          buttonDisabled: false,
          isError,
        };
      case 'idle':
      default:
        return {
          title: "Create with Voice",
          subtitle: "Tap the microphone and describe the topic. Your words will become the chatbot's knowledge.",
          icon: 'microphone',
          iconClass: "",
          buttonDisabled: false,
          isError,
        };
    }
  };
  
  const { title, subtitle, icon, iconClass, buttonDisabled, isError } = getStatusContent();

  const buttonClasses = `w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none`;
  
  const dynamicButtonClasses = isError
    ? 'bg-red-600 shadow-red-500/40 disabled:bg-bg-interactive'
    : (status === 'listening'
        ? 'bg-red-500 shadow-red-500/50'
        : 'bg-accent-secondary shadow-accent-hover/40 disabled:bg-bg-interactive');

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-gradient-to-br from-bg-primary to-accent-gradient-to/30 backdrop-blur-xl animate-fadeIn">
      <header className="flex-shrink-0 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 p-2">
          <Icon name="microphone" className="w-6 h-6 text-accent-primary" />
          <h2 className="font-bold text-lg text-text-primary">Chatquin Zone</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-bg-tertiary transition-colors"
          aria-label="Close Chatquin Zone"
        >
          <Icon name="close" className="w-6 h-6 text-text-secondary" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <button 
            onClick={handleListenClick} 
            disabled={buttonDisabled}
            className={`${buttonClasses} ${dynamicButtonClasses}`}
        >
            <Icon 
                name={icon} 
                className={`w-16 h-16 md:w-20 md:h-20 text-white ${iconClass}`} 
            />
        </button>
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mt-8">{title}</h3>
        <p className="text-text-tertiary max-w-sm mx-auto mt-2">{subtitle}</p>
        
        {status === 'error' && !buttonDisabled && (
            <button onClick={handleListenClick} className="mt-6 bg-bg-tertiary hover:bg-bg-interactive text-white font-bold py-2 px-4 rounded-lg">
                Try Again
            </button>
        )}
      </div>
    </div>
  );
};

export default ChatquinModal;