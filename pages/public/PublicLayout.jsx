import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShieldCheckIcon } from '../../components/icons';
import { useTranslation } from '../../context/LanguageContext';
import ThemeToggle from '../../components/ThemeToggle';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
            <nav className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center group">
                    <div className="bg-gradient-to-tr from-brand-blue to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-brand-blue/50 transition-all duration-300">
                        <img src="/logo.png" alt="SOM ELECT" className="h-8 w-auto" />
                    </div>
                    <span className={`ml-3 text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-gray-900 dark:text-white' : (isHome ? 'text-white' : 'text-gray-900 dark:text-white')}`}>
                        {t('appName')}
                    </span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-8">
                    {['Home', 'About', 'Contact'].map((item) => (
                        <Link 
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                            className={`text-sm font-medium transition-colors duration-300 hover:text-brand-light-blue ${scrolled ? 'text-gray-600 dark:text-gray-300' : (isHome ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300')}`}
                        >
                            {t(`nav${item}`)}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Link 
                        to="/login" 
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${scrolled ? 'text-brand-blue border border-brand-blue hover:bg-brand-blue hover:text-white' : (isHome ? 'text-white border border-white/50 hover:bg-white hover:text-brand-blue' : 'text-brand-blue border border-brand-blue hover:bg-brand-blue hover:text-white')}`}
                    >
                        {t('login')}
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-brand-blue to-purple-600 text-white shadow-lg hover:shadow-brand-blue/50 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {t('getStarted')}
                    </Link>
                </div>
            </nav>
        </header>
    );
};

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-tr from-brand-blue to-purple-600 p-2 rounded-lg">
                                <img src="/logo.png" alt="SOM ELECT" className="h-8 w-auto" />
                            </div>
                            <span className="ml-3 text-xl font-bold">{t('appName')}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {t('footerSlogan') || "Empowering democracy through secure, transparent, and accessible digital voting solutions."}
                        </p>
                        <div className="flex space-x-4">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-colors duration-300">
                                    <span className="sr-only">{social}</span>
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">{t('quickLinks')}</h3>
                        <ul className="space-y-3">
                            {['Home', 'About', 'Contact', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-400 hover:text-brand-light-blue transition-colors duration-200 text-sm">
                                        {t(item === 'FAQ' ? 'faq' : `nav${item}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">{t('contactInfo')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-brand-blue mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span className="text-gray-400 text-sm">Mogadishu, Somalia</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-brand-blue mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span className="text-gray-400 text-sm">info@som-election.so</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-brand-blue mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span className="text-gray-400 text-sm">+252 61 123 4567</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest election updates.</p>
                        <form className="flex flex-col space-y-2">
                            <input type="email" placeholder="Your email address" className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm placeholder-gray-500" />
                            <button type="button" className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-light-blue transition-colors duration-300 text-sm">Subscribe</button>
                        </form>
                    </div>
                </div>
                
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} {t('appName')}. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const PublicLayout = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
