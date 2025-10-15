
import { SavedChatbot } from '../types';

export const generateExportHtml = (chatbot: SavedChatbot): string => {
  // Minify the JSON by removing unnecessary whitespace
  const chatbotJson = JSON.stringify(chatbot);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with ${chatbot.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: sans-serif; }
        .chat-bubble-bot { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .typing-dot { animation: bounce 1.4s infinite ease-in-out both; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
    </style>
</head>
<body class="bg-slate-900 text-white flex flex-col h-screen antialiased">

<div class="flex-shrink-0 p-3 bg-slate-800 border-b border-slate-700/50 flex items-center gap-4">
    <div class="w-8 h-8 flex-shrink-0 bg-cyan-500 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white"><path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h20"></path></svg>
    </div>
    <div>
        <h2 class="font-bold text-slate-200">${chatbot.name}</h2>
        <p class="text-xs text-slate-400">Powered by Gemini</p>
    </div>
</div>

<div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-4">
    <!-- Messages will be injected here -->
</div>

<div class="p-2 bg-slate-800 border-t border-slate-700">
    <form id="chat-form" class="flex items-center gap-2">
        <input id="chat-input" type="text" placeholder="Ask a question..." class="w-full bg-slate-700 border-transparent rounded-full py-2.5 px-4 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none" autocomplete="off">
        <button id="chat-submit" type="submit" class="w-10 h-10 flex-shrink-0 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
    </form>
</div>

<script type="module">
    const API_KEY = \`${process.env.API_KEY}\`;
    const chatbot = ${chatbotJson};
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    let isLoading = false;

    // --- Helper Functions ---
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        const isBot = sender === 'bot';
        
        const botIcon = '<div class="w-8 h-8 flex-shrink-0 bg-cyan-500 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white"><path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h20"></path></svg></div>';
        const userIcon = '<div class="w-8 h-8 flex-shrink-0 bg-slate-600 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-slate-300"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
        
        const textWithMarkdown = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');

        messageDiv.className = \`flex items-start gap-3 \${isBot ? 'justify-start chat-bubble-bot' : 'justify-end'}\`;
        messageDiv.innerHTML = \`
            \${isBot ? botIcon : ''}
            <div class="max-w-[80%] px-4 py-2.5 rounded-2xl break-words \${isBot ? 'bg-slate-700/50 text-slate-300 rounded-bl-none' : 'bg-slate-700 text-slate-200 rounded-br-none'}">
                <p class="whitespace-pre-wrap">\${textWithMarkdown}</p>
            </div>
            \${!isBot ? userIcon : ''}
        \`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start gap-3 justify-start';
        typingDiv.innerHTML = \`
            <div class="w-8 h-8 flex-shrink-0 bg-cyan-500 rounded-full flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white"><path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h20"></path></svg>
            </div>
            <div class="px-4 py-3 rounded-2xl bg-slate-700/50 rounded-bl-none">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-slate-400 rounded-full typing-dot" style="animation-delay: 0s;"></span>
                    <span class="w-2 h-2 bg-slate-400 rounded-full typing-dot" style="animation-delay: .2s;"></span>
                    <span class="w-2 h-2 bg-slate-400 rounded-full typing-dot" style="animation-delay: .4s;"></span>
                </div>
            </div>
        \`;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    function toggleLoading(state) {
        isLoading = state;
        chatInput.disabled = state;
        chatSubmit.disabled = state;
    }

    if (!API_KEY || API_KEY === 'undefined' || API_KEY.trim() === '') {
        addMessage("Error: API Key is not configured for this exported chatbot. Please ensure the app environment has a valid API_KEY.", 'bot');
        toggleLoading(true); // Disable input
    } else {
        // --- Gemini API Integration ---
        async function callGemini(model, config, messageHistory) {
            const API_URL = \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${API_KEY}\`;
            
            const systemInstruction = config.systemInstruction;
            
            const contents = [];
            if (systemInstruction) {
                 contents.push({ role: 'user', parts: [{ text: "IMPORTANT: The following is a system instruction that sets up your personality and rules. Read it carefully and follow it for all subsequent responses. Do not repeat it back to the user.\\n\\n" + systemInstruction }]});
                 contents.push({ role: 'model', parts: [{ text: "Understood. I will follow these instructions." }]});
            }
            contents.push(...messageHistory);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents }),
            });

            if (!response.ok) {
                const error = await response.json();
                let errorMessage = 'Failed to get response from API.';
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }
                 if (response.status === 400 && errorMessage.includes("API key not valid")) {
                     errorMessage = "The configured API key is invalid.";
                }
                addMessage(\`Sorry, an error occurred: \${errorMessage}\`, 'bot');
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        }

        // --- Chatbot Logic ---
        let messages = [];
        
        const systemInstruction = \`You are a friendly, mature, and helpful assistant named \${chatbot.name}. Your persona is: "\${chatbot.persona || 'A knowledgeable and helpful guide'}". Always respond in a warm and engaging tone, using emojis where appropriate to make the conversation feel more personal. ✨
        \${chatbot.knowledgeScope === 'strict' 
            ? "Your knowledge is STRICTLY and ABSOLUTELY limited to the following text. Do NOT answer any questions or discuss any topics outside of this context. If the answer is not in the text, you MUST say 'I'm sorry, but that information doesn't seem to be in the document I have. 🧐 Is there anything else I can look for?'. Do not use any of your general knowledge." 
            : "You should first try to answer questions based on the provided text. If the answer isn't available in the text, you may use your vast general knowledge to provide a helpful response. When using general knowledge, you can gently mention it, for example, by saying 'Based on my general knowledge...'. "}
        CONTEXT:
        ---
        \${chatbot.contextText}
        ---\`;
        
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userInput = chatInput.value.trim();
            if (!userInput || isLoading) return;

            addMessage(userInput, 'user');
            messages.push({ role: 'user', parts: [{ text: userInput }] });
            chatInput.value = '';
            
            toggleLoading(true);
            showTypingIndicator();

            try {
                const botResponse = await callGemini('gemini-2.5-flash', { systemInstruction }, messages);
                messages.push({ role: 'model', parts: [{ text: botResponse }] });
                removeTypingIndicator();
                addMessage(botResponse, 'bot');
            } catch (error) {
                console.error(error);
                removeTypingIndicator();
            } finally {
                toggleLoading(false);
            }
        });

        // --- App Start ---
        const greeting = \`Hello there! I'm \${chatbot.name}, your friendly guide for this document. ✨ What's on your mind? 😊\`;
        addMessage(greeting, 'bot');
    }

</script>
</body>
</html>
  `;
};
