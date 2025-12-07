import React, { useState, useEffect, useContext } from 'react';
import api, { API_BASE_URL } from '../../utils/api';
import { ToastContext } from '../../App';
import Spinner from '../../utils/Spinner';

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-full overflow-y-auto">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {children}
            </div>
        </div>
    );
};

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            showToast("Failed to fetch users", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentUser(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userData = {
            username: form.username.value,
            email: form.email.value,
            mobile: form.mobile.value,
            nationalId: form.nationalId.value,
            dob: form.dob.value,
            role: form.role.value,
            status: form.status.value,
        };
        
        if (form.password.value) {
            userData.password = form.password.value;
        }

        try {
            if (isEditing) {
                await api.put(`/users/${currentUser.id}`, userData);
                showToast("User updated successfully", "success");
            } else {
                await api.post('/users', userData);
                showToast("User created successfully", "success");
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error("User operation failed:", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error occurred";
            // Debug info
            console.log('Attempted URL:', `${API_BASE_URL}/users`);
            showToast(`Error: ${errorMsg} (Target: ${API_BASE_URL})`, "error");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
            try {
                await api.delete(`/users/${id}`);
                showToast("User deleted successfully", "success");
                fetchUsers();
            } catch (error) {
                showToast("Failed to delete user", "error");
            }
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-light-blue transition flex items-center">
                    <span className="mr-2 text-xl font-light">+</span> Add New User
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2 justify-end">
                                        <button onClick={() => handleOpenEditModal(user)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit User' : 'Create New User'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username *</label>
                            <input type="text" id="username" defaultValue={currentUser?.username} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                            <input type="email" id="email" defaultValue={currentUser?.email} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile *</label>
                            <input type="text" id="mobile" defaultValue={currentUser?.mobile} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID *</label>
                            <input type="text" id="nationalId" defaultValue={currentUser?.nationalId} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                            <input type="date" id="dob" defaultValue={currentUser?.dob ? new Date(currentUser.dob).toISOString().split('T')[0] : ''} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select id="role" defaultValue={currentUser?.role || 'voter'} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="voter">Voter</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" defaultValue={currentUser?.status || 'Verified'} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="Pending">Pending</option>
                                <option value="Verified">Verified</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{isEditing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                            <input type="password" id="password" required={!isEditing} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-light-blue">{isEditing ? 'Update User' : 'Create User'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagementPage;
