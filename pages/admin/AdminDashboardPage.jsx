import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ElectionIcon, ProfileIcon, ResultsIcon } from '../../components/icons';
import Spinner from '../../utils/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500 opacity-10 rounded-bl-full -mr-4 -mt-4`}></div>
        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <div className={`p-4 rounded-xl bg-${color}-50 text-${color}-600`}>
                {icon}
            </div>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({ totalElections: 0, totalCandidates: 0, totalVoters: 0, activeElectionsCount: 0 });
    const [activeElections, setActiveElections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/votes/stats/admin');
                setStats(data.stats);
                setActiveElections(data.activeElections);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    
    if (loading) return <Spinner />;

    const chartData = activeElections.map(e => ({
        name: e.name,
        participation: e.voterParticipation || 0
    }));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg">Overview of system performance and election status.</p>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <StatCard title="Total Elections" value={stats.totalElections} icon={<ElectionIcon className="w-8 h-8"/>} color="blue" />
                 <StatCard title="Total Candidates" value={stats.totalCandidates} icon={<ProfileIcon className="w-8 h-8"/>} color="purple" />
                 <StatCard title="Total Voters" value={stats.totalVoters} icon={<ResultsIcon className="w-8 h-8"/>} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-brand-blue rounded-full mr-3"></span>
                        Active Elections
                    </h2>
                     {activeElections.length > 0 ? (
                        <div className="space-y-5">
                            {activeElections.map(election => (
                                <div key={election.id} className="group p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-brand-blue transition-colors">{election.name}</h3>
                                            <p className="text-sm text-gray-500">Ends: {new Date(election.endDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div className="bg-brand-blue h-2 rounded-full transition-all duration-1000" style={{width: `${election.voterParticipation || 0}%`}}></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                                        <span>Participation</span>
                                        <span>{election.voterParticipation || 0}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">No active elections at the moment.</p>}
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                        Voter Participation
                    </h2>
                    {activeElections.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorParticipation" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                                        itemStyle={{color: '#374151', fontWeight: '600'}}
                                    />
                                    <Bar dataKey="participation" fill="url(#colorParticipation)" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <ResultsIcon className="w-12 h-12 mb-2 opacity-50"/>
                            <p>No data to display</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
