'use client';
import { createContext, useState, ReactNode } from 'react';

type ThemeContextType = {
    primaryColor: string;
    tagline: string;
    app_name: string | null;
    logo: string | null;
    setPrimaryColor: (color: string) => void;
    setTagline: (tag: string) => void;
    setLogo: (logo: string | null) => void;
    setAppname: (app_name: string | null) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    primaryColor: '#3b82f6',
    tagline: 'Your Awesome App',
    app_name: null,
    logo: null,
    setPrimaryColor: () => {},
    setTagline: () => {},
    setLogo: () => {},
    setAppname: () => {},
});

ThemeContext.displayName = "ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6');
    const [tagline, setTagline] = useState<string>('Your Awesome App');
    const [logo, setLogo] = useState<string | null>(null);
    const [app_name, setAppname] = useState<string | null>(null);

    return (
        <ThemeContext.Provider
            value={{
                primaryColor,
                tagline,
                logo,
                app_name,
                setPrimaryColor,
                setTagline,
                setLogo,
                setAppname
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
