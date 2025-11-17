import React from 'react';
import { ChatMessage } from '../types';
import DuckAvatar from './DuckAvatar';

interface ChatBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
  botAvatar: string;
  userAvatar: string | null;
}

const Avatar: React.FC<{ avatar: string | null; isBot: boolean }> = ({ avatar, isBot }) => {
    if (isBot && avatar === 'duck') {
        return (
            <div className="w-10 h-10 flex-shrink-0">
                <DuckAvatar />
            </div>
        );
    }

    return (
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-lg shadow-sm flex-shrink-0 overflow-hidden">
            {avatar && avatar.startsWith('data:image') 
                ? <img src={avatar} alt={isBot ? 'Bot Avatar' : 'User Avatar'} className="w-full h-full object-cover" /> 
                : avatar || '👤'
            }
        </div>
    );
};


export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoading = false, botAvatar, userAvatar }) => {
  const isUser = message.role === 'user';

  const bubbleClasses = isUser
    ? 'bg-[--bubble-user-bg] text-[--bubble-user-text]'
    : 'bg-[--bubble-model-bg] text-[--bubble-model-text]';

  const wrapperClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-end gap-3 w-full ${wrapperClasses} animate-bubble-in`}>
      {!isUser && <Avatar avatar={botAvatar} isBot={true} />}
      <div className={`flex flex-col max-w-sm md:max-w-md lg:max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl shadow-md transition-colors ${bubbleClasses}`}
        >
          {message.image && (
            <img 
              src={message.image} 
              alt="Chat content" 
              className="rounded-lg mb-2 max-w-full h-auto max-h-64 object-contain"
            />
          )}
          {isLoading ? (
             <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-[--accent-color-disabled] rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[--accent-color-disabled] rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[--accent-color-disabled] rounded-full animate-pulse"></div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.text}</p>
          )}
        </div>
      </div>
       {isUser && <Avatar avatar={userAvatar} isBot={false} />}
    </div>
  );
};
