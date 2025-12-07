
import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import Spinner from '../../utils/Spinner';
import { ToastContext } from '../../App';
import { API_BASE_URL } from '../../utils/api';
import { ElectionIcon, ShieldCheckIcon } from '../../components/icons';

const ActiveElectionsPage = () => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState({}); // { electionId: [candidate1, ...] }
    const [expandedElection, setExpandedElection] = useState(null);
    const [votes, setVotes] = useState({}); // { electionId: candidateId }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [electionsRes, myVotesRes] = await Promise.all([
                    api.get('/elections'),
                    api.get('/votes/myvotes')
                ]);
                
                const activeElections = electionsRes.data.filter(e => e.status === 'Active');
                setElections(activeElections);

                const userVotes = myVotesRes.data.reduce((acc, vote) => {
                    acc[vote.election] = vote.candidate;
                    return acc;
                }, {});
                setVotes(userVotes);

            } catch (err) {
                setError('Failed to load elections.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleToggleCandidates = async (electionId) => {
        const newExpandedId = expandedElection === electionId ? null : electionId;
        setExpandedElection(newExpandedId);

        if (newExpandedId && !candidates[newExpandedId]) {
            try {
                const { data } = await api.get(`/candidates/election/${newExpandedId}`);
                setCandidates(prev => ({ ...prev, [newExpandedId]: data }));
            } catch (err) {
                console.error("Failed to fetch candidates:", err);
                setError(`Failed to load candidates for the selected election.`);
            }
        }
    };

    const handleVote = async (electionId, candidateId) => {
        if (votes[electionId]) {
            showToast("You have already voted in this election.", "error");
            return;
        }
        if (window.confirm("Are you sure you want to cast your vote? This action cannot be undone.")) {
            try {
                 await api.post('/votes', { electionId, candidateId });
                 setVotes(prev => ({ ...prev, [electionId]: candidateId }));
                 showToast("Your vote has been cast successfully!", "success");
            } catch(err) {
                showToast(err.response?.data?.message || "Failed to cast your vote.", "error");
            }
        }
    };
    
    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-100">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Active Elections</h1>
                    <p className="text-gray-600 mt-1">Cast your vote in ongoing elections. Your voice matters.</p>
                </div>
                <div className="relative mt-4 md:mt-0 w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search elections..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none shadow-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            {elections.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <ElectionIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Elections</h3>
                    <p className="text-gray-500 max-w-md mx-auto">There are currently no elections available for voting. Please check back later or view past results.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {elections.map(election => (
                        <div key={election.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-blue-50 rounded-2xl text-brand-blue hidden md:block">
                                        <ElectionIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-bold text-gray-800">{election.name}</h2>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleCandidates(election.id)}
                                    className={`px-6 py-2.5 font-medium rounded-xl transition-all duration-200 flex items-center ${
                                        expandedElection === election.id 
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                        : 'bg-brand-blue text-white hover:bg-brand-dark shadow-lg shadow-brand-blue/30'
                                    }`}
                                >
                                    {expandedElection === election.id ? 'Hide Candidates' : 'View Candidates'}
                                    <svg className={`w-4 h-4 ml-2 transform transition-transform ${expandedElection === election.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                            </div>

                            {expandedElection === election.id && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-8 animate-fade-in">
                                    <h3 className="font-bold text-gray-700 mb-6 flex items-center">
                                        <ShieldCheckIcon className="w-5 h-5 mr-2 text-brand-blue" />
                                        Select a Candidate
                                    </h3>
                                    {!candidates[election.id] ? <Spinner /> : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {candidates[election.id].map(candidate => {
                                                const hasVotedForThis = votes[election.id] === candidate.id;
                                                const hasVotedForOther = !!votes[election.id] && !hasVotedForThis;
                                                
                                                return (
                                                    <div 
                                                        key={candidate.id} 
                                                        className={`bg-white border rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 ${
                                                            hasVotedForThis 
                                                            ? 'border-green-500 ring-2 ring-green-500/20 shadow-md' 
                                                            : hasVotedForOther
                                                                ? 'opacity-50 grayscale border-gray-200'
                                                                : 'border-gray-200 hover:border-brand-blue/50 hover:shadow-md'
                                                        }`}
                                                    >
                                                        <img 
                                                            src={`${API_BASE_URL.replace('/api', '')}/uploads/${candidate.photo}`} 
                                                            alt={candidate.fullName} 
                                                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 mb-4 shadow-sm"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = `${API_BASE_URL.replace('/api', '')}/uploads/no-photo.jpg` }}
                                                        />
                                                        <h4 className="font-bold text-gray-800 text-lg mb-1">{candidate.fullName}</h4>
                                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{candidate.manifesto || "No manifesto provided."}</p>
                                                        
                                                        <button
                                                            onClick={() => handleVote(election.id, candidate.id)}
                                                            disabled={!!votes[election.id]}
                                                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                                                                hasVotedForThis
                                                                ? 'bg-green-500 text-white cursor-default shadow-lg shadow-green-500/30'
                                                                : hasVotedForOther
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-brand-blue text-white hover:bg-brand-dark shadow-lg shadow-brand-blue/30 hover:-translate-y-0.5'
                                                            }`}
                                                        >
                                                            {hasVotedForThis ? (
                                                                <span className="flex items-center justify-center">
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                    Voted
                                                                </span>
                                                            ) : 'Vote For Candidate'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveElectionsPage;
