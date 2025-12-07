
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import { ResultsIcon } from '../../components/icons';

const COLORS = ['#0D47A1', '#1976D2', '#42A5F5', '#90CAF9', '#BBDEFB'];

const VoteResultsPage = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionResults, setSelectedElectionResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('pie');
    const [detailedView, setDetailedView] = useState(false);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const { data } = await api.get('/elections');
                // Assuming only completed elections should show results
                setElections(data.filter(e => e.status === 'Completed')); 
            } catch (error) {
                console.error("Failed to fetch elections", error);
            } finally {
                setLoading(false);
            }
        };
        fetchElections();
    }, []);

    const handleViewDetails = async (election) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/votes/results/${election.id}`);
            setSelectedElectionResults({ ...election, ...data });
            setDetailedView(true);
        } catch (error) {
            console.error("Failed to fetch election results", error);
            alert("Could not load results for this election.");
        } finally {
            setLoading(false);
        }
    }
    
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
    );

    if (detailedView && selectedElectionResults) {
        const chartData = selectedElectionResults.results.map(c => ({ name: c.name, votes: c.votes }));
        
        return (
             <div className="max-w-6xl mx-auto animate-fade-in">
                <button 
                    onClick={() => setDetailedView(false)} 
                    className="mb-6 flex items-center text-gray-500 hover:text-brand-blue transition-colors font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Elections
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedElectionResults.name}</h2>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(selectedElectionResults.startDate).toLocaleDateString()} - {new Date(selectedElectionResults.endDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                        Total Votes: {selectedElectionResults.totalVotes.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 bg-white rounded-lg p-1 shadow-sm border border-gray-200 flex">
                                 <button onClick={() => setChartType('bar')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${chartType === 'bar' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Bar Chart</button>
                                 <button onClick={() => setChartType('pie')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${chartType === 'pie' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Pie Chart</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="h-96 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                               {chartType === 'pie' ? (
                                    <PieChart>
                                        <Pie 
                                            data={chartData} 
                                            cx="50%" 
                                            cy="50%" 
                                            labelLine={false} 
                                            outerRadius={140} 
                                            innerRadius={80}
                                            fill="#8884d8" 
                                            dataKey="votes" 
                                            nameKey="name" 
                                            paddingAngle={5}
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                               ) : (
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                        <Legend verticalAlign="top" height={36} iconType="circle" />
                                        <Bar dataKey="votes" fill="#1976D2" radius={[8, 8, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                               )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800">Detailed Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold">Rank</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Candidate</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Votes</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Percentage</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedElectionResults.results.map((candidate, index) => {
                                    const percentage = selectedElectionResults.totalVotes > 0 ? ((candidate.votes / selectedElectionResults.totalVotes) * 100).toFixed(1) : 0;
                                    return (
                                        <tr key={candidate.candidateId} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{candidate.name}</td>
                                            <td className="px-6 py-4 font-medium">{candidate.votes.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-medium">{percentage}%</td>
                                            <td className="px-6 py-4 w-1/4">
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Election Results</h1>
                <p className="text-gray-600 mt-1">View the outcomes of past elections and detailed analytics.</p>
            </div>

             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                {elections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {elections.map(election => (
                            <div key={election.id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-brand-blue/30 transition-all duration-300 cursor-pointer relative overflow-hidden" onClick={() => handleViewDetails(election)}>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ResultsIcon className="w-24 h-24 text-brand-blue transform rotate-12 translate-x-4 -translate-y-4" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <ResultsIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-brand-blue transition-colors">{election.name}</h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Ended on {new Date(election.endDate).toLocaleDateString()}
                                    </p>
                                    <button className="w-full py-2.5 bg-gray-50 text-gray-700 font-bold rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                        View Results
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                            <ResultsIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Available</h3>
                        <p className="text-gray-500 max-w-md">There are no completed elections to display results for at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoteResultsPage;
