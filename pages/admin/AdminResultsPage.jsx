import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';

const AdminResultsPage = () => {
    const [view, setView] = useState('summary'); // 'summary', 'details', 'voters'
    const [elections, setElections] = useState([]);
    const [selectedElectionData, setSelectedElectionData] = useState(null);
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const { data } = await api.get('/elections');
                setElections(data);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchElections();
    }, []);

    const handleViewDetails = async (election) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/votes/results/${election.id}`);
            setSelectedElectionData({ ...election, ...data });
            setView('details');
        } catch (err) {
            alert('Could not fetch results.');
        } finally { setLoading(false); }
    };
    
    const handleViewVoters = async (election) => {
        try {
             setLoading(true);
            const { data } = await api.get(`/votes/voters/${election.id}`);
            setVoters(data);
            setView('voters');
        } catch(err) {
             alert('Could not fetch voters list.');
        } finally { setLoading(false); }
    };

    if (loading) return <div>Loading...</div>;

    if (view === 'voters') {
         return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <button onClick={() => setView('details')} className="mb-4 text-brand-blue font-semibold">&larr; Back to Results</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Voters for {selectedElectionData.name}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Voter</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Vote Cast</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voters.map(voter => (
                                <tr key={voter.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{voter.user.username}</td>
                                    <td className="px-6 py-4">{voter.user.email}</td>
                                    <td className="px-6 py-4">{voter.candidate.fullName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    
    if (view === 'details' && selectedElectionData) {
        const chartData = selectedElectionData.results.map(c => ({ name: c.name, votes: c.votes }));
        
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <button onClick={() => setView('summary')} className="mb-4 text-brand-blue font-semibold">&larr; Back to Elections</button>
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedElectionData.name}</h2>
                     <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 mt-1">Total Votes: {selectedElectionData.totalVotes.toLocaleString()}</p>
                      <button onClick={() => handleViewVoters(selectedElectionData)} className="text-sm text-brand-blue font-semibold hover:underline">View Voters List</button>
                    </div>
                </div>
                 <div className="mb-8 h-80">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Results Visualization</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="votes" fill="#1976D2" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Detailed Results</h3>
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Candidate</th>
                                <th className="px-6 py-3">Votes</th>
                                <th className="px-6 py-3">Percentage</th>
                                <th className="px-6 py-3">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedElectionData.results.map((c, i) => (
                                <tr key={i} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                    <td className="px-6 py-4">{c.votes}</td>
                                    <td className="px-6 py-4">{selectedElectionData.totalVotes > 0 ? ((c.votes / selectedElectionData.totalVotes) * 100).toFixed(1) : 0}%</td>
                                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{i + 1}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Election Results</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-3">
                    {elections.map(election => (
                        <div key={election.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">{election.name}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${election.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{election.status}</span>
                                <button onClick={() => handleViewDetails(election)} className="px-4 py-2 text-sm bg-brand-blue text-white rounded-md hover:bg-brand-light-blue">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminResultsPage;
