
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Toast from './utils/Toast';
import { FullPageSpinner } from './utils/Spinner';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Import Layouts and Pages
import PublicLayout from './pages/public/PublicLayout';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import CandidateDetailsPage from './pages/public/CandidateDetailsPage';
import VoterLayout from './pages/voter/VoterLayout';
import AdminLayout from './pages/admin/AdminLayout';

export const AuthContext = React.createContext();
export const ToastContext = React.createContext();

const AppContent = () => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => {
        try {
            const storedAuth = JSON.parse(localStorage.getItem('userInfo'));
            if (storedAuth && storedAuth.token) {
                setAuth(storedAuth);
            }
        } catch (error) {
            console.error("Failed to parse auth info from localStorage", error);
            localStorage.removeItem('userInfo');
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const authData = {
            ...userData,
            // Ensure photo is part of the auth object, even if it's the default
            photo: userData.photo || 'no-photo.jpg' 
        };
        localStorage.setItem('userInfo', JSON.stringify(authData));
        setAuth(authData);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setAuth(null);
    };

    const showToast = (message, type) => {
        setToast({ message, type });
    };
    
    if (loading) {
        return <FullPageSpinner />;
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            <ToastContext.Provider value={{ showToast }}>
                <HashRouter>
                    <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: '' })} />
                    <Routes>
                        {/* Public Routes */}
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={auth ? <Navigate to={`/${auth.role}/dashboard`} /> : <LoginPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/register" element={auth ? <Navigate to={`/${auth.role}/dashboard`} /> : <RegisterPage />} />
                            <Route path="/forgot-password" element={auth ? <Navigate to={`/${auth.role}/dashboard`} /> : <ForgotPasswordPage />} />
                            <Route path="/candidate/:id" element={<CandidateDetailsPage />} />
                        </Route>

                        {/* Protected Voter Routes */}
                        <Route path="/voter/*" element={auth && auth.role === 'voter' ? <VoterLayout /> : <Navigate to="/login" />} />
                        
                        {/* Protected Admin Routes */}
                        <Route path="/admin/*" element={auth && auth.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />} />

                        {/* Fallback Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </HashRouter>
            </ToastContext.Provider>
        </AuthContext.Provider>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
