import React, { useState, useEffect, useCallback } from 'react';
import { UserSettings, Theme } from './types';
import Login from './components/Login';
import ChatScreen from './components/ChatScreen';
import StartScreen from './components/StartScreen';

// Helper function to derive theme colors from a base accent color
const getThemeColors = (accentColor: string) => {
    // This is a simplified example. A more robust solution might use a color library.
    const hover = accentColor.slice(0, 7) + 'dd'; // Add some transparency for hover
    const disabled = accentColor.slice(0, 7) + '88'; // More transparency for disabled
    return {
        '--accent-color': accentColor,
        '--accent-color-hover': hover,
        '--accent-color-disabled': disabled,
        '--accent-color-ring': accentColor,
    };
};

const App: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [preLoginTheme, setPreLoginTheme] = useState<Theme>('light');
    const [preLoginAccent, setPreLoginAccent] = useState('#F59E0B'); // Default accent to Amber/Yellow

    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error("Failed to parse user settings from localStorage", error);
            localStorage.removeItem('userSettings');
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        
        root.classList.remove('dark');

        if (settings) {
            // User is logged in, apply their saved theme
            body.classList.add('gradient-background');
            root.classList.toggle('dark', settings.theme === 'dark');
            const themeColors = getThemeColors(settings.accentColor);
            Object.entries(themeColors).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        } else {
            // User is on start/login screen
            root.classList.toggle('dark', preLoginTheme === 'dark');
            body.classList.add('gradient-background');
            const themeColors = getThemeColors(preLoginAccent); // Use state here
            Object.entries(themeColors).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    }, [settings, preLoginTheme, preLoginAccent]);

    const handleLogin = useCallback((newSettings: Omit<UserSettings, 'isLoggedIn'>) => {
        const fullSettings: UserSettings = { ...newSettings, isLoggedIn: true };
        localStorage.setItem('userSettings', JSON.stringify(fullSettings));
        setSettings(fullSettings);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('userSettings');
        setSettings(null);
        setShowLogin(false); // Go back to the StartScreen
    }, []);

    const handleSettingsChange = useCallback((updatedSettings: Partial<UserSettings>) => {
        setSettings(prevSettings => {
            if (!prevSettings) return null;
            const newSettings = { ...prevSettings, ...updatedSettings };
            localStorage.setItem('userSettings', JSON.stringify(newSettings));
            return newSettings;
        });
    }, []);
    
    const handleThemeToggle = useCallback(() => {
        setPreLoginTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);
    
    const handleAccentChange = useCallback((color: string) => {
        setPreLoginAccent(color);
    }, []);

    if (!settings?.isLoggedIn) {
        return showLogin
            ? <Login onLogin={handleLogin} initialTheme={preLoginTheme} onAccentColorChange={handleAccentChange} />
            : <StartScreen onNavigate={() => setShowLogin(true)} onThemeToggle={handleThemeToggle} />;
    }

    return <ChatScreen settings={settings} onSettingsChange={handleSettingsChange} onLogout={handleLogout} />;
};

export default App;
