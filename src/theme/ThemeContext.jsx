import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
    primary: '#2980b9',
    background: '#ebeaea',
    card: '#FFFFFF',
    text: '#1E2132',
    textSecondary: '#697386',
    textMuted: '#95a5a6',
    border: '#E0E4EB',
    error: '#be4859',
    success: '#27ae60',
    warning: '#f39c12',
    infoCard: '#ebf7fd',
    info: '#3498db',
    buttonDisabled: '#86badd',
    searchBackground: '#FFFFFF',
    headerBackground: '#2980b9',
    headerText: '#FFFFFF',
    cardBackground: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputBorder: '#ddd',
    shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
    primary: '#3498db',
    background: '#141414',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#777777',
    border: '#333333',
    error: '#be4859',
    success: '#2ecc71',
    warning: '#f1c40f',
    infoCard: '#1E1E1E',
    info: '#3498db',
    buttonDisabled: '#333333',
    searchBackground: '#2A2A2A',
    headerBackground: '#1A1A1A',
    headerText: '#FFFFFF',
    cardBackground: '#2A2A2A',
    inputBackground: '#2A2A2A',
    inputBorder: '#444444',
    shadow: 'rgba(0, 0, 0, 0.3)',
};

// Create the theme context
const ThemeContext = createContext({
    theme: lightTheme,
    isDark: false,
    toggleTheme: () => { },
    setThemeMode: () => { },
});

// Theme storage key
const THEME_STORAGE_KEY = 'app_theme_mode';

// Theme provider component
export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme on startup
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme) {
                    setIsDark(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadTheme();
    }, []);

    // Save theme preference when it changes
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        }
    }, [isDark, isLoaded]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const setThemeMode = (mode) => {
        setIsDark(mode === 'dark');
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);