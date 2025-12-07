
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../App';
import api from '../../utils/api';
import { ElectionIcon, ProfileIcon, ShieldCheckIcon } from '../../components/icons';
import Spinner from '../../utils/Spinner';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex items-center justify-between group">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800 group-hover:text-brand-blue transition-colors">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
    </div>
);

const VoterDashboardPage = () => {
    const { auth } = useContext(AuthContext);
    const [stats, setStats] = useState({ activeElections: 0, registeredCandidates: 0 });
    const [activeElections, setActiveElections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/votes/stats/voter');
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
    
    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-brand-blue to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {auth?.username}!</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Your voice matters. Participate in active elections and help shape the future of our community.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <Link to="/voter/elections" className="px-6 py-3 bg-white text-brand-blue font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors">
                            Vote Now
                        </Link>
                        <Link to="/voter/results" className="px-6 py-3 bg-brand-blue/50 text-white font-bold rounded-xl border border-white/30 hover:bg-brand-blue/70 transition-colors">
                            View Results
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard 
                    title="Active Elections" 
                    value={stats.activeElections} 
                    icon={<ElectionIcon className="w-6 h-6"/>} 
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                 <StatCard 
                    title="Registered Candidates" 
                    value={stats.registeredCandidates} 
                    icon={<ProfileIcon className="w-6 h-6"/>} 
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard 
                    title="Your Participation" 
                    value="100%" 
                    icon={<ShieldCheckIcon className="w-6 h-6"/>} 
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
            </div>

            {/* Active Elections Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Active Elections</h2>
                    <Link to="/voter/elections" className="text-brand-blue font-medium hover:text-brand-dark transition-colors">
                        View All &rarr;
                    </Link>
                </div>
                
                {activeElections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeElections.map(election => (
                            <div key={election.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                            <ElectionIcon className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                            Active
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-brand-blue transition-colors">{election.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Ends on <span className="font-medium text-gray-700">{new Date(election.endDate).toLocaleDateString()}</span>
                                    </p>
                                    
                                    <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                                        <span>{election.candidateCount} Candidates</span>
                                        <span>{election.voterParticipation || 0}% Participation</span>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <Link to={`/voter/elections`} className="block w-full text-center py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-300">
                                        Cast Vote
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <ElectionIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Elections</h3>
                        <p className="text-gray-500">There are currently no elections available for voting. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoterDashboardPage;
