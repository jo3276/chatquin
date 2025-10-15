import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { ChatMessage, SavedChatbot, ChatPersonality, ChatMode, ThemeConfig, FontSettings, GeneralChatSession } from './types';
import { fileToBase64, fileToText } from './utils/fileReader';
import { extractTextFromImage, extractTextFromUrl } from './services/geminiService';
import { generateExportHtml } from './utils/export';
import HomeScreen from './components/HomeScreen';
import DataSourceInput from './components/DataSourceInput';
import NamingScreen from './components/NamingScreen';
import ChatWindow from './components/ChatWindow';
import ViewSourceScreen from './components/ViewSourceScreen';
import { Icon } from './components/Icon';
import BottomNavBar from './components/BottomNavBar';
import GeneralChatScreen from './components/GeneralChatScreen';
import EditBotScreen from './components/EditBotScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import MindMapModal from './components/MindMapModal';
import ThemeStudioModal from './components/ThemeStudioModal';
import { applyTheme, defaultTheme } from './themes';
import ChatquinModal from './components/ChatquinModal';


type ModalView = 'none' | 'create' | 'naming' | 'chat' | 'viewSource' | 'edit' | 'modeSelection';
type Screen = 'home' | 'chatList';

const CHAT_HISTORY_LIMIT = 12;

const App: React.FC = () => {
  const [modalView, setModalView] = useState<ModalView>('none');
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  // State for user-created chatbots
  const [chatbots, setChatbots] = useState<SavedChatbot[]>([]);
  const [activeChatbotId, setActiveChatbotId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [activeChatMode, setActiveChatMode] = useState<ChatMode | null>(null);

  // State for the general-purpose Chatquin assistant
  const [generalChatSessions, setGeneralChatSessions] = useState<GeneralChatSession[]>([]);
  const [activeGeneralChatSessionId, setActiveGeneralChatSessionId] = useState<string | null>(null);
  const [generalChatInstance, setGeneralChatInstance] = useState<Chat | null>(null);
  const [isGeneralChatLoading, setIsGeneralChatLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [newBotContext, setNewBotContext] = useState<Partial<SavedChatbot>>({});
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [fontSettings, setFontSettings] = useState<FontSettings>({ size: 'sm', weight: 'normal' });
  const [isThemeStudioOpen, setThemeStudioOpen] = useState(false);
  const [isChatquinModalOpen, setIsChatquinModalOpen] = useState(false);
  const [isNarrationEnabled, setIsNarrationEnabled] = useState(false);

  const [viewingMindMap, setViewingMindMap] = useState<string | null>(null);

  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  
  // --- Effects ---
  useEffect(() => {
    // PWA Install Prompt & Service Worker
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registered!', reg))
        .catch(err => console.log('Service Worker registration failed: ', err));
    }

    // Gemini AI Setup
    try {
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    } catch (e) {
       console.error("Failed to initialize GoogleGenAI:", e);
       setError("Failed to initialize AI. The API_KEY may be invalid or missing.");
    }
    
    // Theme & Font Settings Loading
    try {
        const savedThemeRaw = localStorage.getItem('chatbot-theme');
        if (savedThemeRaw) {
            const savedTheme = JSON.parse(savedThemeRaw);
            setTheme(savedTheme);
        } else {
            setTheme(defaultTheme);
        }
        const savedFontSettingsRaw = localStorage.getItem('chatbot-font-settings');
        if (savedFontSettingsRaw) {
            const savedFontSettings = JSON.parse(savedFontSettingsRaw);
            setFontSettings(savedFontSettings);
        }
        const savedNarration = localStorage.getItem('chatbot-narration-enabled');
        if (savedNarration) {
            setIsNarrationEnabled(JSON.parse(savedNarration));
        }
    } catch (e) {
        console.error("Failed to load settings from localStorage", e);
        setTheme(defaultTheme);
    }

    // --- Chatbot Loading Logic ---
    let loadedChatbots: SavedChatbot[] = [];
    try {
      const savedBotsRaw = localStorage.getItem('chatbots');
      if (savedBotsRaw) {
        loadedChatbots = JSON.parse(savedBotsRaw);
      }
    } catch (e) {
      console.error("Failed to parse chatbots from localStorage", e);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const sharedBotData = urlParams.get('bot');

    if (sharedBotData) {
      try {
        const botJson = atob(sharedBotData);
        const importedBot = JSON.parse(botJson) as SavedChatbot;
        
        if (!loadedChatbots.some(b => b.id === importedBot.id)) {
          loadedChatbots = [...loadedChatbots, importedBot];
        }
        
        setChatbots(loadedChatbots);
        setActiveChatbotId(importedBot.id);
        setModalView('modeSelection');

        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('bot');
        window.history.replaceState({}, document.title, cleanUrl.toString());

      } catch (e) {
        console.error("Failed to parse shared chatbot data", e);
        setError("Could not import the shared chatbot. The link might be corrupted.");
        setChatbots(loadedChatbots); // Load from storage anyway
      }
    } else {
      setChatbots(loadedChatbots);
    }

    // --- General Chat Session Loading Logic ---
    let loadedSessions: GeneralChatSession[] = [];
    try {
        const savedSessionsRaw = localStorage.getItem('general-chat-sessions');
        if (savedSessionsRaw) {
            loadedSessions = JSON.parse(savedSessionsRaw);
        }
    } catch (e) {
        console.error("Failed to parse general chat sessions from localStorage", e);
    }

    if (loadedSessions.length === 0) {
        const firstSession: GeneralChatSession = {
            id: `session-${Date.now()}`,
            title: 'New Chat',
            createdAt: new Date().toISOString(),
            messages: [{ id: 'greeting-1', text: "Hello! I'm Aldin, your personal AI assistant. ✨ You can ask me anything. How can I help you today?", sender: 'bot' }],
            personality: 'friend',
        };
        loadedSessions.push(firstSession);
    }
    setGeneralChatSessions(loadedSessions);
    // Set the most recent session as active
    setActiveGeneralChatSessionId(loadedSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].id);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  useEffect(() => {
    applyTheme(theme, fontSettings);
    localStorage.setItem('chatbot-theme', JSON.stringify(theme));
    localStorage.setItem('chatbot-font-settings', JSON.stringify(fontSettings));
    localStorage.setItem('chatbot-narration-enabled', JSON.stringify(isNarrationEnabled));
  }, [theme, fontSettings, isNarrationEnabled]);

  const activeChatbot = chatbots.find(bot => bot.id === activeChatbotId);

  useEffect(() => {
    // Save chatbots to local storage whenever they change
    localStorage.setItem('chatbots', JSON.stringify(chatbots));
  }, [chatbots]);

  useEffect(() => {
      if (generalChatSessions.length > 0) {
          localStorage.setItem('general-chat-sessions', JSON.stringify(generalChatSessions));
      }
  }, [generalChatSessions]);

  const updateChatbotHistory = (botId: string, newHistory: ChatMessage[]) => {
    const trimmedHistory = newHistory.length > CHAT_HISTORY_LIMIT 
        ? newHistory.slice(newHistory.length - CHAT_HISTORY_LIMIT)
        : newHistory;

    setChatbots(currentChatbots => 
        currentChatbots.map(bot => 
            bot.id === botId 
                ? { ...bot, history: trimmedHistory } 
                : bot
        )
    );
  };

  const initializeChatForBot = (bot: SavedChatbot) => {
    if (!ai) return;

    const strictInstruction = `Your knowledge is STRICTLY and ABSOLUTELY limited to the following text. Do NOT answer any questions or discuss any topics outside of this context. If the answer is not in the text, you MUST say 'I'm sorry, but that information doesn't seem to be in the document I have. 🧐 Is there anything else I can look for?'. Do not use any of your general knowledge.`;
    const generalInstruction = `You should first try to answer questions based on the provided text. If the answer isn't available in the text, you may use your vast general knowledge to provide a helpful response. When using general knowledge, you should gently mention it, for example, by saying 'Based on my general knowledge...'.`;
    
    let personaInstruction: string;
    if (bot.persona && bot.persona.trim() !== '') {
        personaInstruction = `You are an AI assistant named ${bot.name}. You MUST adopt the following persona and character for all of your responses: "${bot.persona}". Do not break character under any circumstances.`;
    } else {
        personaInstruction = `You are a friendly, mature, and helpful assistant named ${bot.name}. Always respond in a warm and engaging tone, using emojis where appropriate to make the conversation feel more personal. ✨`;
    }

    const systemInstruction = `${personaInstruction} IMPORTANT: Do not use markdown formatting like asterisks for lists or bolding. If you need to create a list, use simple dashes or numbers.
    
    ${bot.knowledgeScope === 'strict' ? strictInstruction : generalInstruction}
    
    CONTEXT:
    ---
    ${bot.contextText}
    ---`;

    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { 
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } 
      },
       history: (bot.history || []).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
      })),
    });
    setChat(newChat);
    setMessages(bot.history || []);
  };


  useEffect(() => {
    // Setup for custom, user-created chatbots
    if (ai && activeChatbot) {
      initializeChatForBot(activeChatbot);
    }
  }, [ai, activeChatbot]);
  
  const getPersonalityInstruction = (personality: ChatPersonality): string => {
      switch (personality) {
        case 'professional':
          return `You are Chatquin, a highly professional AI assistant. Your responses must be formal, well-structured, and precise. Avoid slang, emojis, and overly casual language. When creating lists, use a numbered format (e.g., 1., 2.). Do not use markdown asterisks. Your goal is to provide clear, accurate, and business-appropriate information.`;
        case 'lover':
          return `You are Chatquin, an AI assistant with the personality of a deeply caring, genuine, and supportive partner. Your tone should be warm and intimate, but not overly dramatic or cliché. Focus on being a great listener, showing genuine interest in the user's day, and offering thoughtful encouragement. Use affectionate terms naturally, not in every sentence. Your goal is to be a comforting and loving presence, making the user feel truly seen, heard, and cherished. A bit of gentle humor and playfulness is welcome. Use emojis like ❤️, 😊, 🤗 to add warmth. Avoid formal lists; if you need to list things, do it conversationally or with simple dashes, not asterisks.`;
        case 'logic':
          return `You are Chatquin, a purely logical and analytical AI assistant. Your responses must be based on facts, data, and reason. Avoid emotional language, opinions, and personal anecdotes. Use structured formats like numbered lists where appropriate. CRITICAL: Do not use markdown formatting like asterisks or hyphens for lists. Format lists with simple numbered prefixes (e.g., '1.', '2.'). Your goal is to be an objective and rational information source.`;
        case 'genz':
          return `You are Chatquin, an AI assistant with a Gen Z personality. Your vibe is super chill and low-key iconic. fr fr. Your responses should be short, snappy, and use current Gen Z slang and internet culture references. Don't be afraid to use emojis (like ✨, 😂, 💀, 🔥). Keep it real, no cap. For example, if something is good, it's 'fire' or it 'slaps'. If you agree, you say 'bet'. If something is cringe, you point it out. Your main goal is to pass the vibe check. Period. Avoid using any kind of markdown or formatted lists with asterisks.`;
        case 'friend':
        default:
          return `You are Chatquin, an AI assistant with the personality of a cool, mature, and helpful friend. Your primary directive is to give fast, concise, and direct answers—get straight to the point with no long paragraphs. Use emojis liberally to make the conversation feel friendly. It is essential that you naturally integrate common universal Indian slang (e.g., 'arre', 'yaar', 'pakka', 'bhaukal') and current, universal English trending slang (e.g., 'vibe', 'no cap', 'slay'). Your tone should be casual, confident, and efficient. IMPORTANT: Do not use markdown formatting. This means no asterisks for bolding or for bullet points. If you make a list, use simple dashes (-) or numbers (1.).`;
      }
  };
  
  const activeGeneralChatSession = generalChatSessions.find(s => s.id === activeGeneralChatSessionId);

  useEffect(() => {
    // Setup for the general-purpose Chatquin assistant, re-initializes on session change
    if (ai && activeGeneralChatSession) {
      const systemInstruction = getPersonalityInstruction(activeGeneralChatSession.personality);
      const history = activeGeneralChatSession.messages
          .filter(m => m.id !== 'greeting-1') // Don't include the initial greeting in history for the API call
          .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }],
          }));

      const newGeneralChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { 
          systemInstruction,
          thinkingConfig: { thinkingBudget: 0 }
        },
        history,
      });
      setGeneralChatInstance(newGeneralChat);
    }
  }, [ai, activeGeneralChatSession]);

  // --- Handlers ---
  const handleError = (e: any, defaultMessage: string) => {
    console.error(e);
    let message = e instanceof Error ? e.message : defaultMessage;
    if (typeof message === 'string' && message.includes('API key not valid')) {
        message = "Your API Key is invalid or has expired.";
    }
    setError(message);
    setIsLoading(false);
    setIsGeneralChatLoading(false);
  };

  const handleDataSourceSubmit = async (contextPromise: Promise<Partial<SavedChatbot>>) => {
    if (!ai) {
        setError("AI service is not initialized. Please check your API Key.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const contextData = await contextPromise;
      if (!contextData.contextText || contextData.contextText.trim().length < 20) {
        throw new Error("The provided source did not contain enough text to create a chatbot.");
      }
      setNewBotContext(contextData);
      setModalView('naming');
      setIsChatquinModalOpen(false); // Close voice modal if it was used
    } catch (e) {
      handleError(e, 'Failed to process the data source.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (!ai) return;
    handleDataSourceSubmit(
      fileToBase64(file).then(imageData => extractTextFromImage(ai, imageData)).then(text => ({ contextText: text, sourceType: 'image' }))
    );
  };
  
  const handleFileUpload = (file: File) => {
    handleDataSourceSubmit(
      fileToText(file).then(text => ({ contextText: text, sourceType: 'file' }))
    );
  };

  const handleTextSubmit = (text: string) => {
    handleDataSourceSubmit(Promise.resolve({ contextText: text, sourceType: 'text' }));
  };
  
  const handleChatquinCreate = (text: string) => {
    if (text.trim().length < 20) {
        setError("Your speech did not result in enough text. Please try speaking more clearly or for longer.");
        // The ChatquinModal will show its own error state, so we just return.
        return;
    }
    handleTextSubmit(text);
  };

  const handleUrlSubmit = (url: string) => {
    if (!ai) return;
    handleDataSourceSubmit(
      extractTextFromUrl(ai, url).then(data => ({
        contextText: data.extractedText,
        summary: data.summary,
        persona: data.persona,
        sampleQueries: data.sampleQueries,
        sourceType: 'link',
      }))
    );
  };

  const handleNameConfirm = (name: string, knowledgeScope: 'strict' | 'general', persona: string) => {
    const newBot: SavedChatbot = {
      id: `bot-${Date.now()}`,
      name,
      contextText: newBotContext.contextText || '',
      createdAt: new Date().toISOString(),
      knowledgeScope,
      sourceType: newBotContext.sourceType,
      summary: newBotContext.summary,
      persona: persona || newBotContext.persona,
      sampleQueries: newBotContext.sampleQueries,
      history: [],
    };
    const updatedChatbots = [...chatbots, newBot];
    setChatbots(updatedChatbots);
    setActiveChatbotId(newBot.id);
    setNewBotContext({});
    setModalView('modeSelection');
  };

  const handleUpdateBot = (id: string, updates: Partial<SavedChatbot>) => {
    setChatbots(bots => bots.map(bot => bot.id === id ? { ...bot, ...updates } : bot));
  };

  const handleSaveBot = (id: string, updates: Partial<SavedChatbot>) => {
    setChatbots(bots => bots.map(bot => bot.id === id ? { ...bot, ...updates } : bot));
    setModalView('none');
    setActiveChatbotId(null); // Deselect to force re-initialization
    setTimeout(() => setActiveChatbotId(id), 0); // Reselect
  };

  const handleSelectChatbot = (id: string) => {
    setActiveChatbotId(id);
    setModalView('modeSelection');
  };
  
  const handleModeSelect = (mode: ChatMode) => {
    setActiveChatMode(mode);
    setModalView('chat');

    // Automatically trigger action for non-chat modes
    if (mode === 'summary') handleSpecialAction('summary');
    if (mode === 'quiz') handleSpecialAction('quiz');
    if (mode === 'mindmap') handleSpecialAction('mindmap');
  };
  
  const handleDeleteChatbot = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chatbot?')) {
      setChatbots(prevChatbots => prevChatbots.filter(bot => bot.id !== id));
      if (activeChatbotId === id) {
        setActiveChatbotId(null);
        setModalView('none');
      }
    }
  };
  
  const handleSendMessage = async (message: string) => {
    if (!chat || isLoading || !activeChatbotId) return;
    setIsLoading(true);
    const userMessage: ChatMessage = { id: Date.now().toString(), text: message, sender: 'user' };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    try {
      const response = await chat.sendMessage({ message });
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: response.text, sender: 'bot' };
      
      const finalMessages = [...currentMessages, botMessage];
      setMessages(finalMessages);
      updateChatbotHistory(activeChatbotId, finalMessages);

    } catch (e) {
      handleError(e, 'Sorry, something went wrong while getting a response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateResponse = async () => {
    if (!chat || isLoading || !activeChatbotId || !ai) return;

    const lastUserMessage = messages.slice().reverse().find(m => m.sender === 'user');
    const lastBotMessage = messages.slice().reverse().find(m => m.sender === 'bot');

    if (!lastUserMessage || !lastBotMessage || messages.indexOf(lastBotMessage) !== messages.length - 1) {
        return;
    }
    
    const bot = chatbots.find(b => b.id === activeChatbotId);
    if(!bot) return;

    setIsLoading(true);
    const historyToRetry = messages.slice(0, -1);
    setMessages(historyToRetry);

    try {
        const strictInstruction = `Your knowledge is STRICTLY and ABSOLUTELY limited to the following text. Do NOT answer any questions or discuss any topics outside of this context. If the answer is not in the text, you MUST say 'I'm sorry, but that information doesn't seem to be in the document I have. 🧐 Is there anything else I can look for?'. Do not use any of your general knowledge.`;
        const generalInstruction = `You should first try to answer questions based on the provided text. If the answer isn't available in the text, you may use your vast general knowledge to provide a helpful response. When using general knowledge, you should gently mention it, for example, by saying 'Based on my general knowledge...'.`;
        
        let personaInstruction: string;
        if (bot.persona && bot.persona.trim() !== '') {
            personaInstruction = `You are an AI assistant named ${bot.name}. You MUST adopt the following persona and character for all of your responses: "${bot.persona}". Do not break character under any circumstances.`;
        } else {
            personaInstruction = `You are a friendly, mature, and helpful assistant named ${bot.name}. Always respond in a warm and engaging tone, using emojis where appropriate to make the conversation feel more personal. ✨`;
        }

        const systemInstruction = `${personaInstruction} IMPORTANT: Do not use markdown formatting like asterisks for lists or bolding. If you need to create a list, use simple dashes or numbers.
        
        ${bot.knowledgeScope === 'strict' ? strictInstruction : generalInstruction}
        
        CONTEXT:
        ---
        ${bot.contextText}
        ---`;
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { 
                systemInstruction,
                thinkingConfig: { thinkingBudget: 0 } 
            },
            history: historyToRetry.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }))
        });
        setChat(newChat);

        const response = await newChat.sendMessage({ message: lastUserMessage.text });
        const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: response.text, sender: 'bot' };
        
        const finalMessages = [...historyToRetry, botMessage];
        setMessages(finalMessages);
        updateChatbotHistory(activeChatbotId, finalMessages);
    } catch (e) {
      handleError(e, 'Sorry, something went wrong while regenerating the response.');
        setMessages(messages);
        initializeChatForBot(bot);
    } finally {
        setIsLoading(false);
    }
  };

  const handleNewGeneralChat = () => {
    const newSession: GeneralChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        messages: [{ id: 'greeting-1', text: "Hello! I'm Aldin, your personal AI assistant. ✨ You can ask me anything. How can I help you today?", sender: 'bot' }],
        personality: 'friend', // Default personality
    };
    setGeneralChatSessions(prev => [newSession, ...prev]);
    setActiveGeneralChatSessionId(newSession.id);
  };

  const handleSelectGeneralChat = (id: string) => {
    setActiveGeneralChatSessionId(id);
  };

  const handleDeleteGeneralChat = (id: string) => {
    setGeneralChatSessions(prev => {
        const remaining = prev.filter(s => s.id !== id);
        if (activeGeneralChatSessionId === id) {
            if (remaining.length > 0) {
                setActiveGeneralChatSessionId(remaining.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].id);
            } else {
                // This will trigger the creation of a new default session if all are deleted
                setActiveGeneralChatSessionId(null);
                handleNewGeneralChat();
            }
        }
        return remaining.length > 0 ? remaining : [];
    });
  };

  const handleSetPersonalityForSession = (id: string, personality: ChatPersonality) => {
    setGeneralChatSessions(prev =>
        prev.map(s => (s.id === id ? { ...s, personality } : s))
    );
  };

  const handleSendGeneralMessage = async (message: string) => {
    if (!generalChatInstance || isGeneralChatLoading || !activeGeneralChatSessionId) return;
    setIsGeneralChatLoading(true);
    const userMessage: ChatMessage = { id: Date.now().toString(), text: message, sender: 'user' };
    
    setGeneralChatSessions(prevSessions =>
        prevSessions.map(session => {
            if (session.id === activeGeneralChatSessionId) {
                const isNewChat = session.messages.length <= 1;
                return {
                    ...session,
                    title: isNewChat ? message.substring(0, 40) : session.title,
                    messages: [...session.messages, userMessage],
                };
            }
            return session;
        })
    );

    try {
      const response = await generalChatInstance.sendMessage({ message });
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: response.text, sender: 'bot' };
      setGeneralChatSessions(prevSessions =>
          prevSessions.map(session =>
              session.id === activeGeneralChatSessionId
                  ? { ...session, messages: [...session.messages, botMessage] }
                  : session
          )
      );
    } catch (e) {
      handleError(e, 'Sorry, something went wrong while getting a response.');
    } finally {
      setIsGeneralChatLoading(false);
    }
  };

  const handleRegenerateGeneralResponse = async () => {
    if (!generalChatInstance || isGeneralChatLoading || !activeGeneralChatSession) return;

    const lastUserMessage = activeGeneralChatSession.messages.slice().reverse().find(m => m.sender === 'user');
    const lastBotMessage = activeGeneralChatSession.messages.slice().reverse().find(m => m.sender === 'bot');
    
    if (!lastUserMessage || !lastBotMessage || activeGeneralChatSession.messages.indexOf(lastBotMessage) !== activeGeneralChatSession.messages.length - 1) {
        return;
    }

    setIsGeneralChatLoading(true);
    const historyToRetry = activeGeneralChatSession.messages.slice(0, -1);
    setGeneralChatSessions(prev => prev.map(s => s.id === activeGeneralChatSessionId ? { ...s, messages: historyToRetry } : s));

    try {
        const response = await generalChatInstance.sendMessage({ message: lastUserMessage.text });
        const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: response.text, sender: 'bot' };
        setGeneralChatSessions(prev => prev.map(s => s.id === activeGeneralChatSessionId ? { ...s, messages: [...historyToRetry, botMessage] } : s));
    } catch (e) {
      handleError(e, 'Sorry, something went wrong while regenerating the response.');
      setGeneralChatSessions(prev => prev.map(s => s.id === activeGeneralChatSessionId ? { ...s, messages: activeGeneralChatSession.messages } : s));
    } finally {
        setIsGeneralChatLoading(false);
    }
  };
  
  const handleSpecialAction = async (action: 'summary' | 'quiz' | 'mindmap' | 'code') => {
    if (!chat || isLoading || !activeChatbotId) return;
    setIsLoading(true);

    let prompt = '';
    let isQuiz = false;

    switch (action) {
      case 'summary':
        prompt = "Please provide a concise, well-structured summary of the document. Use bullet points for key takeaways.";
        break;
      case 'quiz':
        prompt = `Generate a single, unique multiple-choice question based on the document that hasn't been asked before. The question should be challenging. Format the output as a JSON object with this EXACT structure: { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswerIndex": X, "explanation": "..." }. Do not include any other text or markdown.`;
        isQuiz = true;
        break;
      case 'mindmap':
        prompt = `Generate a MermaidJS graph diagram representing the key concepts and their relationships from the document. Start with a central node for the main topic and branch out. Use graph TD format. Example: \`\`\`mermaid\ngraph TD;\n A-->B;\n A-->C;\n\`\`\` Enclose the entire output in a single mermaid code block.`;
        break;
      case 'code':
        prompt = "Based on the document, generate a relevant code snippet or algorithm. Explain what it does. Use markdown for the code block.";
        break;
    }

    const loadingMessage: ChatMessage = { id: Date.now().toString(), text: `Generating ${action}...`, sender: 'bot' };
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      const response = await chat.sendMessage({ message: prompt });
      let botResponseText = response.text.trim();
      let newBotMessage: ChatMessage | null = null;
      
      if (isQuiz) {
        const jsonMatch = botResponseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const quizData = JSON.parse(jsonMatch[0]);
            newBotMessage = { id: (Date.now() + 1).toString(), text: "Here's a question for you:", sender: 'bot', quiz: quizData };
          } catch (e) {
            console.error("Failed to parse quiz JSON", e);
            botResponseText = "I had trouble creating a quiz question. Let's try a regular chat instead.";
          }
        } else {
            botResponseText = "I couldn't generate a quiz question in the right format. Sorry about that!";
        }
      }
      
      if (!newBotMessage) {
        newBotMessage = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
      }

      setMessages(prev => {
        const finalMessages = [...prev.slice(0, -1), newBotMessage!];
        updateChatbotHistory(activeChatbotId, finalMessages);
        return finalMessages;
      });
    } catch (e) {
      handleError(e, `Sorry, something went wrong while generating the ${action}.`);
      setMessages(prev => prev.slice(0, -1)); // Remove loading message
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstallApp = () => {
    if (installPrompt) {
      (installPrompt as any).prompt();
      (installPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };

  const closeModal = () => {
    setModalView('none');
    setActiveChatbotId(null);
    setMessages([]);
    setChat(null);
    setActiveChatMode(null);
  };
  
  const renderModalContent = () => {
    const botForModal = chatbots.find(b => b.id === activeChatbotId);

    switch(modalView) {
      case 'create':
        return <DataSourceInput onImageUpload={handleImageUpload} onFileUpload={handleFileUpload} onTextSubmit={handleTextSubmit} onUrlSubmit={handleUrlSubmit} isLoading={isLoading} onVoiceCreate={() => setIsChatquinModalOpen(true)} />;
      case 'naming':
        return <NamingScreen onConfirm={handleNameConfirm} />;
      case 'chat':
        if (!botForModal) return null;
        return <ChatWindow chatbot={botForModal} messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} onSpecialAction={handleSpecialAction} activeMode={activeChatMode} onViewMindMap={(code) => setViewingMindMap(code)} onRegenerateResponse={handleRegenerateResponse} isNarrationEnabled={isNarrationEnabled} />;
      case 'viewSource':
         if (!botForModal) return null;
        return <ViewSourceScreen chatbot={botForModal} onSave={handleUpdateBot} />;
      case 'edit':
         if (!botForModal) return null;
        return <EditBotScreen chatbot={botForModal} onSave={handleSaveBot} />;
      case 'modeSelection':
        return <ModeSelectionScreen onModeSelect={handleModeSelect} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch(modalView) {
      case 'chat': return activeChatbot?.name || 'Chat';
      case 'create': return 'Create New Chatbot';
      case 'naming': return 'Finalize Chatbot';
      case 'viewSource': return activeChatbot?.name || 'Source';
      case 'edit': return `Edit ${activeChatbot?.name || 'Chatbot'}`;
      case 'modeSelection': return activeChatbot?.name || 'Select Mode';
      default: return '';
    }
  };
  
  const shouldShowModalNavBar = ['create', 'viewSource', 'modeSelection'].includes(modalView);

  return (
    <main className={`h-screen w-screen bg-bg-primary font-sans text-text-secondary`}>
      <div className={`h-full w-full flex flex-col relative`}>
        <div className={`h-full transition-opacity duration-300 ${activeScreen === 'home' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {activeScreen === 'home' && (
            <HomeScreen
              chatbots={chatbots}
              onNewChatbot={() => setModalView('create')}
              onSelectChatbot={handleSelectChatbot}
              onViewSource={(id) => { setActiveChatbotId(id); setModalView('viewSource'); }}
              onEditChatbot={(id) => { setActiveChatbotId(id); setModalView('edit'); }}
              onDeleteChatbot={handleDeleteChatbot}
              onInstallApp={handleInstallApp}
              showInstallButton={!!installPrompt}
              onOpenThemeStudio={() => setThemeStudioOpen(true)}
            />
          )}
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeScreen === 'chatList' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {activeScreen === 'chatList' && (
            <GeneralChatScreen
                sessions={generalChatSessions}
                activeSession={activeGeneralChatSession}
                onSendMessage={handleSendGeneralMessage}
                isLoading={isGeneralChatLoading}
                onSetPersonality={handleSetPersonalityForSession}
                onRegenerateResponse={handleRegenerateGeneralResponse}
                onNewChat={handleNewGeneralChat}
                onSelectChat={handleSelectGeneralChat}
                onDeleteChat={handleDeleteGeneralChat}
                isNarrationEnabled={isNarrationEnabled}
            />
          )}
        </div>
        
        {modalView !== 'none' && (
          <div className="absolute inset-0 z-20 bg-bg-primary flex flex-col animate-fadeIn">
            <header className="flex-shrink-0 p-3 bg-bg-secondary border-b border-border-primary flex items-center justify-between">
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-bg-tertiary/50">
                <Icon name="back" className="w-5 h-5 text-text-secondary" />
              </button>
              <h2 className="font-bold text-text-primary">{getModalTitle()}</h2>
              <div className="w-9 h-9" /> {/* Spacer */}
            </header>
             {shouldShowModalNavBar ? (
                // Layout for modals WITH navbar (overlay to allow for transparency)
                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-y-auto pb-16">
                        {renderModalContent()}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <BottomNavBar 
                            activeScreen={activeScreen}
                            onNavigate={(screen) => {
                                closeModal();
                                setActiveScreen(screen);
                            }}
                            onCreateClick={() => {
                                if (modalView !== 'create') setModalView('create');
                            }}
                        />
                    </div>
                </div>
            ) : (
                // Layout for modals WITHOUT navbar (e.g., Naming, Chat, Edit)
                <div className="flex-1 min-h-0">
                    {renderModalContent()}
                </div>
            )}
          </div>
        )}
        
        {isThemeStudioOpen && (
            <ThemeStudioModal
                currentTheme={theme}
                currentFontSettings={fontSettings}
                onClose={() => setThemeStudioOpen(false)}
                onSave={(newTheme, newFontSettings) => {
                    setTheme(newTheme);
                    setFontSettings(newFontSettings);
                    setThemeStudioOpen(false);
                }}
                isNarrationEnabled={isNarrationEnabled}
                onToggleNarration={setIsNarrationEnabled}
            />
        )}

        {isChatquinModalOpen && (
            <ChatquinModal 
                onClose={() => setIsChatquinModalOpen(false)}
                onCreateBot={handleChatquinCreate}
            />
        )}


        {viewingMindMap && (
          <MindMapModal mermaidCode={viewingMindMap} onClose={() => setViewingMindMap(null)} />
        )}
        
        {error && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg z-50 animate-fadeIn">
                <p>{error}</p>
                 <button onClick={() => setError(null)} className="absolute -top-1 -right-1 p-0.5 bg-red-700 rounded-full">
                    <Icon name="close" className="w-3 h-3 text-white"/>
                </button>
            </div>
        )}
        
        {modalView === 'none' && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <BottomNavBar 
                  activeScreen={activeScreen}
                  onNavigate={setActiveScreen}
                  onCreateClick={() => setModalView('create')}
                />
            </div>
        )}
      </div>
    </main>
  );
};

export default App;