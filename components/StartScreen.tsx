import React from 'react';
import DuckAvatar from './DuckAvatar';

interface StartScreenProps {
    onNavigate: () => void;
    onThemeToggle: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNavigate, onThemeToggle }) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 text-center text-slate-800 gap-16">
            <div className="flex flex-col items-center gap-8 animate-bubble-in">
                 <button onClick={onThemeToggle} aria-label="Toggle theme" className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[--bg-color] focus-visible:ring-[--accent-color-ring] rounded-full">
                    <DuckAvatar size={150} />
                 </button>
                 <h1 className="text-4xl font-bold text-[--text-color]" style={{ color: 'var(--accent-color)' }}>YuvAi</h1>
            </div>

            <div className="w-full max-w-sm flex flex-col items-center">
                <button 
                    onClick={onNavigate} 
                    className="w-full bg-transparent border-2 font-semibold py-3 px-6 rounded-full transition-colors"
                    style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
