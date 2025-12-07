import React, { useState, useContext, useRef } from 'react';
import api, { API_BASE_URL } from '../../utils/api';
import { AuthContext } from '../../App';

const AdminSettingsPage = () => {
    const { auth, login } = useContext(AuthContext);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setLoading(true);

        if (passwords.newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.put('/auth/updatepassword', passwords);
            setMessage(data.message);
            setMessageType('success');
            setPasswords({ currentPassword: '', newPassword: '' });
            setConfirmPassword('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update password.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            setLoading(true);
            const { data } = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Update local auth state with new photo
            login({ ...auth, photo: data.photo });
            
            setMessage('Profile image updated successfully');
            setMessageType('success');
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Failed to update profile image.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Image Section */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Image</h2>
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-6 group">
                            <img 
                                src={auth?.photo ? `${API_BASE_URL.replace('/api', '')}/uploads/${auth.photo}` : 'https://via.placeholder.com/150'} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-sm"
                            />
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <span className="text-white font-medium text-sm">Change</span>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                        <button 
                            onClick={() => fileInputRef.current.click()}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                        >
                            Upload New Photo
                        </button>
                        <p className="mt-4 text-xs text-gray-500 text-center">
                            Recommended: Square image, max 2MB.<br/>Supported: JPG, PNG.
                        </p>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        {message && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                                required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                                required
                            />
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="w-full px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-light-blue transition disabled:bg-gray-400 font-medium shadow-sm hover:shadow">
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
