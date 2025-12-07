
import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { ToastContext } from '../../App';
import Spinner from '../../utils/Spinner';
import { API_BASE_URL } from '../../utils/api';

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

const CandidateManagementPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCandidate, setCurrentCandidate] = useState(null);
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cands, elecs] = await Promise.all([
                api.get('/candidates'),
                api.get('/elections')
            ]);
            setCandidates(cands.data);
            setElections(elecs.data);
        } catch (error) {
            showToast("Failed to fetch data", "error");
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentCandidate(null);
        setShowModal(true);
    };
    
    const handleOpenEditModal = (candidate) => {
        setIsEditing(true);
        setCurrentCandidate(candidate);
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        formData.append('fullName', form.elements.fullName.value);
        formData.append('email', form.elements.email.value);
        formData.append('election', form.elements.election.value);
        formData.append('bio', form.elements.bio.value);
        if (form.elements.photo.files[0]) {
            formData.append('photo', form.elements.photo.files[0]);
        }

        try {
            if (isEditing) {
                 await api.put(`/candidates/${currentCandidate.id}`, formData);
                showToast("Candidate updated successfully", "success");
            } else {
                 await api.post('/candidates', formData);
                showToast("Candidate added successfully", "success");
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} candidate.`, "error");
        }
    };
    
    const handleDeleteCandidate = async (id) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await api.delete(`/candidates/${id}`);
                showToast("Candidate deleted successfully", "success");
                fetchData();
            } catch (error) {
                showToast("Failed to delete candidate", "error");
            }
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Candidate Management</h1>
                <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-light-blue transition flex items-center">
                    <span className="mr-2 text-xl font-light">+</span> Add New Candidate
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Candidate</th>
                                <th scope="col" className="px-6 py-3">Contact</th>
                                <th scope="col" className="px-6 py-3">Election</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map(candidate => (
                                <tr key={candidate.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full object-cover" src={`${API_BASE_URL.replace('/api', '')}/uploads/${candidate.photo}`} alt={candidate.fullName} />
                                            <div className="pl-3">{candidate.fullName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{candidate.email}</td>
                                    <td className="px-6 py-4">{candidate.election?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 flex space-x-2 justify-end">
                                        <button onClick={() => handleOpenEditModal(candidate)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                        <button onClick={() => handleDeleteCandidate(candidate.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Candidate' : 'Register New Candidate'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName">Full Name *</label>
                            <input type="text" id="fullName" defaultValue={currentCandidate?.fullName} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="email">Email *</label>
                            <input type="email" id="email" defaultValue={currentCandidate?.email} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="election">Election *</label>
                            <select id="election" defaultValue={currentCandidate?.election?.id} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
                                <option value="">Select Election</option>
                                {elections.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="photo">Candidate Photo</label>
                            <input type="file" id="photo" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                             {isEditing && currentCandidate.photo && <p className="text-xs text-gray-500 mt-1">Current: {currentCandidate.photo}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" rows="3" defaultValue={currentCandidate?.bio} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Brief description about the candidate..."></textarea>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-light-blue">{isEditing ? 'Update Candidate' : 'Add Candidate'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CandidateManagementPage;
