
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../App';
import { ToastContext } from '../../App';
import api from '../../utils/api';
import Spinner from '../../utils/Spinner';
import { API_BASE_URL } from '../../utils/api';
import { ProfileIcon, ShieldCheckIcon } from '../../components/icons';

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all scale-100">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {children}
            </div>
        </div>
    );
};

const VoterProfilePage = () => {
    const { auth, login } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/auth/profile');
            setUserData(data);
        } catch (error) {
            showToast("Failed to fetch profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        formData.append('username', form.elements.username.value);
        formData.append('email', form.elements.email.value);
        formData.append('mobile', form.elements.mobile.value);
        if (form.elements.photo.files[0]) {
            formData.append('photo', form.elements.photo.files[0]);
        }

        try {
            const { data } = await api.put('/auth/profile', formData);
            // We need to update the auth context if the username changed
            const oldUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            const newUserInfo = { ...oldUserInfo, username: data.username, photo: data.photo }; 
            login(newUserInfo); 

            setUserData(data);
            setShowEditModal(false);
            setImagePreview(null);
            showToast("Profile updated successfully!", "success");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to update profile.", "error");
        }
    };

    if (loading) return <Spinner />;
    if (!userData) return <div className="text-center py-10 text-gray-500">Could not load profile information.</div>;
    
    const profileImageUrl = userData.photo && userData.photo !== 'no-photo.jpg' 
        ? `${API_BASE_URL.replace('/api', '')}/uploads/${userData.photo}`
        : null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and account settings.</p>
                </div>
                <button 
                    onClick={() => setShowEditModal(true)} 
                    className="px-6 py-2.5 bg-brand-blue text-white font-medium rounded-xl shadow-lg shadow-brand-blue/30 hover:bg-brand-dark hover:shadow-brand-blue/40 transition-all duration-300 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit Profile
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Background */}
                <div className="h-48 bg-gradient-to-r from-brand-blue to-purple-600 relative">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    </div>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Profile Image & Basic Info */}
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt={userData.username}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className={`w-full h-full bg-gradient-to-tr from-brand-blue to-purple-600 flex items-center justify-center ${profileImageUrl ? 'hidden' : 'flex'}`}>
                                    <span className="text-4xl font-bold text-white uppercase">{userData.username?.charAt(0)}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowEditModal(true)}
                                className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                title="Change Photo"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </button>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                            <h2 className="text-3xl font-bold text-gray-800 capitalize">{userData.username}</h2>
                            <p className="text-gray-500 font-medium">{userData.email}</p>
                            <div className="flex items-center mt-2 space-x-3">
                                <span className="px-3 py-1 bg-blue-100 text-brand-blue text-xs font-bold rounded-full uppercase tracking-wide">
                                    {userData.role}
                                </span>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide flex items-center ${userData.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {userData.status === 'Verified' && <ShieldCheckIcon className="w-3 h-3 mr-1" />}
                                    {userData.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <ProfileIcon className="w-5 h-5 mr-2 text-brand-blue" />
                                Personal Information
                            </h3>
                            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
                                    <p className="text-gray-800 font-medium">{userData.username}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                                    <p className="text-gray-800 font-medium">{userData.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Mobile Number</p>
                                    <p className="text-gray-800 font-medium">{userData.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">National ID</p>
                                    <p className="text-gray-800 font-medium">{userData.nationalId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date of Birth</p>
                                    <p className="text-gray-800 font-medium">{new Date(userData.dob).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <ShieldCheckIcon className="w-5 h-5 mr-2 text-brand-blue" />
                                Account Status
                            </h3>
                            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Member Since</p>
                                    <p className="text-gray-800 font-medium">{new Date(userData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Verification Status</p>
                                    <div className="flex items-center mt-1">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${userData.status === 'Verified' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <p className="text-gray-800 font-medium">{userData.status}</p>
                                    </div>
                                    {userData.status !== 'Verified' && (
                                        <p className="text-xs text-orange-500 mt-1">Please contact admin to verify your account.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                    <p className="text-gray-500 text-sm">Update your personal details</p>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Current" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-brand-blue flex items-center justify-center text-white text-2xl font-bold">
                                            {userData.username?.charAt(0)}
                                        </div>
                                    )
                                )}
                            </div>
                            <label htmlFor="photo" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer text-white text-xs font-bold">
                                Change
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="username" defaultValue={userData.username} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" defaultValue={userData.email} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input type="text" id="mobile" defaultValue={userData.mobile} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"/>
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                        <input 
                            type="file" 
                            id="photo" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all"
                        />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-xs text-blue-700">National ID and Date of Birth are verified fields and cannot be changed. Contact admin for corrections.</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand-blue/30">Save Changes</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VoterProfilePage;
