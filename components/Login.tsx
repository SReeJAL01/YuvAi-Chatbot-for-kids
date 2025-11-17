import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserSettings, Theme, ChatMessage } from '../types';
import { ChatBubble } from './ChatBubble';

interface LoginProps {
    onLogin: (settings: Omit<UserSettings, 'isLoggedIn'>) => void;
    initialTheme: Theme;
    onAccentColorChange: (color: string) => void;
}

type LoginStep = 'name' | 'age' | 'color' | 'avatar' | 'done';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const accentColors = [
    { name: 'Violet', hex: '#8B5CF6' },
    { name: 'Sky', hex: '#38BDF8' },
    { name: 'Emerald', hex: '#34D399' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Amber', hex: '#F59E0B' },
];

const Login: React.FC<LoginProps> = ({ onLogin, initialTheme, onAccentColorChange }) => {
    const [step, setStep] = useState<LoginStep>('name');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Store collected data
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState(0);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [accentColor, setAccentColor] = useState('#F59E0B');

    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addBotMessage = useCallback((text: string, delay: number = 0) => {
        return new Promise(resolve => {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'model', text }]);
                resolve(true);
            }, delay);
        });
    }, []);

    useEffect(() => {
        const initialSetup = async () => {
            await addBotMessage("Hey there!", 500);
            await addBotMessage("I'm YuvAi, your new chat buddy!", 1000);
            await addBotMessage("What should I call you?", 1000);
            setIsLoading(false);
        };
        initialSetup();
    }, [addBotMessage]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleNameSubmit = async () => {
        const name = inputValue.trim();
        if (!name) {
            setError('Please enter a name!');
            return;
        }
        setError('');
        setMessages(prev => [...prev, { role: 'user', text: name }]);
        setUserName(name);
        setInputValue('');
        setIsLoading(true);
        setStep('age');
        await addBotMessage(`Nice to meet you, ${name}! 👋`, 1000);
        await addBotMessage("How old are you?", 1000);
        setIsLoading(false);
    };

    const handleAgeSubmit = async () => {
        const age = parseInt(inputValue, 10);
        if (isNaN(age) || age <= 0) {
            setError('Please enter a valid age!');
            return;
        }
        setError('');
        setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
        setUserAge(age);
        setInputValue('');
        setIsLoading(true);
        setStep('color');
        await addBotMessage("Great!", 1000);
        await addBotMessage("What's your favorite color? Pick one!", 1200);
        setIsLoading(false);
    };

    const handleColorSubmit = async (colorHex: string) => {
        const colorName = accentColors.find(c => c.hex === colorHex)?.name || 'this color';
        setMessages(prev => [...prev, { role: 'user', text: `I like ${colorName}!` }]);
        setAccentColor(colorHex);
        onAccentColorChange(colorHex);
        setIsLoading(true);
        setStep('avatar');
        await addBotMessage("Ooh, nice choice! ✨", 1000);
        await addBotMessage("Lastly, you can upload a profile picture if you like.", 1200);
        setIsLoading(false);
    };

    const handleAvatarSubmit = (avatar: string | null) => {
        if (avatar) {
            setMessages(prev => [...prev, { role: 'user', text: '', image: avatar }]);
        } else {
            setMessages(prev => [...prev, { role: 'user', text: "I'll skip for now." }]);
        }
        setUserAvatar(avatar);
        setIsLoading(true);
        setStep('done');
        setTimeout(async () => {
            await addBotMessage(avatar ? "Cute picture! 😊" : "No problem!", 1000);
            await addBotMessage("We're all set. Let's start chatting!", 1200);
            setIsLoading(false);
            setTimeout(() => {
                 onLogin({
                    userName,
                    userAge,
                    userAvatar: avatar, // Use the 'avatar' parameter directly to avoid stale state
                    botAvatar: 'duck',
                    theme: initialTheme,
                    accentColor: accentColor,
                });
            }, 1500);
        }, 500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        if (step === 'name') handleNameSubmit();
        if (step === 'age') handleAgeSubmit();
    };
    
     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64Image = await fileToBase64(file);
            handleAvatarSubmit(base64Image);
        }
    };

    const renderInput = () => {
        if (step === 'color') {
            return (
                <div className="flex justify-center items-center gap-4 p-4 animate-bubble-in">
                    {accentColors.map(color => (
                        <button
                            key={color.hex}
                            onClick={() => handleColorSubmit(color.hex)}
                            className="w-10 h-10 rounded-full transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ backgroundColor: color.hex, ringColor: color.hex, ringOffsetColor: 'var(--bg-color)' }}
                            aria-label={`Select ${color.name} color`}
                        />
                    ))}
                </div>
            )
        }
        if (step === 'avatar') {
            return (
                <div className="flex items-center gap-3 p-4 animate-bubble-in">
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" />
                     <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 px-4 rounded-full font-semibold text-white transition-colors bg-[--accent-color] hover:bg-[--accent-color-hover]">
                        Upload Photo
                     </button>
                     <button onClick={() => handleAvatarSubmit(null)} className="flex-1 py-2 px-4 rounded-full font-semibold bg-[--bubble-model-bg] text-[--bubble-model-text] hover:bg-[--border-color] transition-colors">
                        Skip
                     </button>
                </div>
            );
        }
        if (step === 'done') {
             return null;
        }
        return (
             <form onSubmit={handleSubmit} className="p-2">
                <div className="flex items-center gap-2 p-1 bg-[--card-bg-color] rounded-full shadow-lg border border-[--border-color]">
                    <input
                        type={step === 'age' ? 'number' : 'text'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder=""
                        className="flex-1 bg-transparent focus:outline-none text-[--text-color] placeholder:text-[--text-color-light] text-sm px-4 py-1"
                        disabled={isLoading}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="p-2 bg-[--accent-color] text-white rounded-full hover:bg-[--accent-color-hover] transition-all disabled:bg-[--accent-color-disabled] disabled:cursor-not-allowed"
                        aria-label="Send"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
             </form>
        );
    }
    
    return (
        <div className="flex flex-col h-screen max-h-screen font-sans bg-transparent text-[--text-color]">
             <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 flex flex-col justify-end">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg} botAvatar="duck" userAvatar={userAvatar} />
                ))}
                {isLoading && (
                    <ChatBubble message={{ role: 'model', text: 'Thinking...' }} isLoading={true} botAvatar="duck" userAvatar={userAvatar} />
                )}
                <div ref={chatEndRef} />
            </main>
            <footer className="bg-transparent p-2">
                <div className="max-w-3xl mx-auto">
                    {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
                    {renderInput()}
                </div>
            </footer>
        </div>
    );
};

export default Login;