
import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { ToastContext } from '../../App';
import Spinner from '../../utils/Spinner';

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {children}
            </div>
        </div>
    );
};

const ElectionManagementPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentElection, setCurrentElection] = useState(null);
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/elections');
            setElections(data);
        } catch (error) {
            showToast("Failed to fetch elections", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentElection(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (election) => {
        setIsEditing(true);
        setCurrentElection({
            ...election,
            startDate: new Date(election.startDate).toISOString().split('T')[0],
            endDate: new Date(election.endDate).toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleDeleteElection = async (id) => {
        if (window.confirm("Are you sure you want to delete this election? This action cannot be undone.")) {
            try {
                await api.delete(`/elections/${id}`);
                showToast("Election deleted successfully", "success");
                fetchElections();
            } catch (error) {
                showToast("Failed to delete election", "error");
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const electionData = {
            name: e.target.name.value,
            position: e.target.position.value,
            startDate: e.target.startDate.value,
            endDate: e.target.endDate.value,
        };

        try {
            if (isEditing) {
                await api.put(`/elections/${currentElection.id}`, electionData);
                showToast("Election updated successfully", "success");
            } else {
                await api.post('/elections', electionData);
                showToast("Election created successfully", "success");
            }
            setShowModal(false);
            fetchElections();
        } catch (error) {
            showToast(`Failed to ${isEditing ? 'update' : 'create'} election.`, "error");
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Election Management</h1>
                <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-light-blue transition flex items-center">
                    <span className="mr-2 text-xl font-light">+</span> Create Election
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Election</th>
                                <th scope="col" className="px-6 py-3">Position</th>
                                <th scope="col" className="px-6 py-3">Dates</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elections.map(election => (
                                <tr key={election.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{election.name}</td>
                                    <td className="px-6 py-4">{election.position}</td>
                                    <td className="px-6 py-4">{new Date(election.startDate).toLocaleDateString()} to {new Date(election.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${election.status === 'Active' ? 'bg-green-100 text-green-800' : election.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {election.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2 justify-end">
                                        <button onClick={() => handleOpenEditModal(election)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                        <button onClick={() => handleDeleteElection(election.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Election' : 'Create New Election'}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Election Name</label>
                        <input type="text" id="name" defaultValue={currentElection?.name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                        <input type="text" id="position" defaultValue={currentElection?.position} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" id="startDate" defaultValue={currentElection?.startDate} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" id="endDate" defaultValue={currentElection?.endDate} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-light-blue">{isEditing ? 'Update Election' : 'Create Election'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ElectionManagementPage;
