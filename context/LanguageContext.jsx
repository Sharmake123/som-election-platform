
import React, { createContext, useState, useEffect, useContext } from 'react';
// Statically import translations as the environment does not support dynamic import()
import enMessages from '../locales/en.json';
import soMessages from '../locales/so.json';
import swMessages from '../locales/sw.json';

const LanguageContext = createContext();

const translations = {
    en: enMessages,
    so: soMessages,
    sw: swMessages,
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        // Set document language for accessibility
        document.documentElement.lang = language;
    }, [language]);
    
    const messages = translations[language];

    const t = (key) => {
        return messages[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
