
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'so', name: 'Somali' },
    { code: 'sw', name: 'Swahili' },
];

const LanguageSwitcher = () => {
    const { language, setLanguage } = useTranslation();

    const handleChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="relative">
            <select
                value={language}
                onChange={handleChange}
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-1 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-brand-blue"
            >
                {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-gray-800 dark:bg-gray-700 dark:text-white">
                        {lang.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
