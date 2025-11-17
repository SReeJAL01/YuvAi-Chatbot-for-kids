import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, UserSettings } from '../types';
import { MessageInput } from './MessageInput';
import { ChatBubble } from './ChatBubble';
import { generateResponse } from '../services/geminiService';

interface ChatScreenProps {
    settings: UserSettings;
    onSettingsChange: (updatedSettings: Partial<UserSettings>) => void;
    onLogout: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ settings, onSettingsChange, onLogout }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: 'model',
        text: `Hi ${settings.userName}! I’m YuvAi 👋\nYou can talk to me 💬, show me a picture 📸, or ask me to make or draw something for you ✏️🎨\nWhat do you want to try today?`,
      },
    ]);
  }, [settings.userName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (text: string, image: string | null) => {
    const lowerCaseText = text.toLowerCase().trim();
    if (lowerCaseText === 'exit' || lowerCaseText === 'logout') {
        onLogout();
        return;
    }
      
    setError(null);
    const userMessage: ChatMessage = { role: 'user', text, image };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const modelResponse = await generateResponse(text, image, settings.userAge);
      setMessages(prev => [...prev, modelResponse]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', text: `Oh no, something went wrong! 🥺 ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [settings.userAge, onLogout]);

  return (
    <div className="flex flex-col h-screen max-h-screen font-sans bg-transparent text-[--text-color]">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 flex flex-col justify-end">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} botAvatar={settings.botAvatar} userAvatar={settings.userAvatar} />
        ))}
        {isLoading && (
          <ChatBubble message={{ role: 'model', text: 'Thinking...' }} isLoading={true} botAvatar={settings.botAvatar} userAvatar={settings.userAvatar} />
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="bg-transparent p-2">
        <div className="max-w-3xl mx-auto">
          {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
          <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;