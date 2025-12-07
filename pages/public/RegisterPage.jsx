import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ShieldCheckIcon } from '../../components/icons';
import { useTranslation } from '../../context/LanguageContext';

const RegisterPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        nationalId: '',
        dob: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-brand-dark to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-blue opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>
            </div>

            <div className="max-w-2xl w-full space-y-8 relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-brand-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <img src="/logo.png" alt="SOM ELECT" className="h-12 w-auto" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">{t('registerTitle')}</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        {t('registerSubtitle')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-sm text-red-300 text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-sm text-green-300 text-center">
                            {success}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">{t('username')}</label>
                            <input id="username" type="text" required value={formData.username} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" 
                                placeholder={t('username')} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">{t('email')}</label>
                            <input id="email" type="email" required value={formData.email} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" 
                                placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-300 mb-1">{t('password')}</label>
                            <input id="password" type="password" required value={formData.password} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" 
                                placeholder="••••••••" />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-300 mb-1">{t('reenterPassword')}</label>
                            <input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" 
                                placeholder="••••••••" />
                        </div>
                        <div>
                            <label htmlFor="mobile"  className="block text-sm font-medium text-gray-300 mb-1">{t('mobile')}</label>
                            <input id="mobile" type="tel" required value={formData.mobile} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" 
                                placeholder="61XXXXXXX" />
                        </div>
                        <div>
                            <label htmlFor="nationalId"  className="block text-sm font-medium text-gray-300 mb-1">{t('nationalId')}</label>
                            <input id="nationalId" type="text" required value={formData.nationalId} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" 
                                placeholder={t('nationalId')} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="dob"  className="block text-sm font-medium text-gray-300 mb-1">{t('dob')}</label>
                            <input id="dob" type="date" required value={formData.dob} onChange={handleChange} 
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} 
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-light-blue hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-brand-blue/30">
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {loading ? t('registering') : t('register')}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-400 text-sm mt-6">
                    {t('haveAccount')} <Link to="/login" className="text-brand-light-blue font-bold hover:text-brand-blue transition-colors">{t('login')}</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;