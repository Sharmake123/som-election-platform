
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ShieldCheckIcon } from '../../components/icons';
import { useTranslation } from '../../context/LanguageContext';

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nationalId: '',
        mobile: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { newPassword, confirmPassword } = formData;
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/reset-password', {
                nationalId: formData.nationalId,
                mobile: formData.mobile,
                newPassword: formData.newPassword
            });
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please check your details.');
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

            <div className="max-w-md w-full space-y-8 relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-brand-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <img src="/logo.png" alt="SOM ELECT" className="h-8 w-auto" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Enter your details to verify your identity and set a new password.
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

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-300 mb-1">National ID</label>
                            <input id="nationalId" type="text" required value={formData.nationalId} onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="Enter your National ID" />
                        </div>
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
                            <input id="mobile" type="tel" required value={formData.mobile} onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="Enter your registered mobile" />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <input id="newPassword" type="password" required value={formData.newPassword} onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="••••••••" />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                            <input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="••••••••" />
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
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-400 text-sm mt-6">
                    Remember your password? <Link to="/login" className="text-brand-light-blue font-bold hover:text-brand-blue transition-colors">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
