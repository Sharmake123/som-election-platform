
import React, { useContext } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';
import { AuthContext } from '../../App';
import { DashboardIcon, ElectionIcon, ProfileIcon, ResultsIcon, LogoutIcon, ShieldCheckIcon } from '../../components/icons';

// Import Voter Pages
import VoterDashboardPage from './VoterDashboardPage';
import ActiveElectionsPage from './ActiveElectionsPage';
import VoteResultsPage from './VoteResultsPage';
import VoterProfilePage from './VoterProfilePage';


const VoterSidebar = () => {
    const { logout, auth } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const navItems = [
        { name: 'Dashboard', path: '/voter/dashboard', icon: DashboardIcon },
        { name: 'Active Elections', path: '/voter/elections', icon: ElectionIcon },
        { name: 'Vote Results', path: '/voter/results', icon: ResultsIcon },
        { name: 'Profile', path: '/voter/profile', icon: ProfileIcon },
    ];

    return (
        <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-gray-200 flex flex-col min-h-screen shadow-2xl z-10">
            <div className="h-20 flex items-center justify-center border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                 <img src="/logo.png" alt="SOM ELECT" className="h-10 w-auto" />
                 <span className="ml-3 text-2xl font-bold tracking-tight text-white">Voter Portal</span>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
                <ul>
                    {navItems.map(item => (
                         <li key={item.name} className="mb-1">
                            <Link 
                                to={item.path}
                                className={`flex items-center px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                                    location.pathname.startsWith(item.path) 
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 translate-x-1' 
                                    : 'hover:bg-slate-700/50 hover:text-white hover:translate-x-1'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 mr-4 transition-colors ${location.pathname.startsWith(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-6 py-6 border-t border-slate-700/50 bg-slate-900/30">
                <div className="flex items-center mb-6 p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-sm">
                    {auth?.photo && auth.photo !== 'no-photo.jpg' ? (
                        <img
                            src={`${API_BASE_URL.replace('/api', '')}/uploads/${auth.photo}`}
                            alt={auth.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-brand-accent shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent to-purple-600 flex items-center justify-center font-bold text-white uppercase shadow-md">
                            {auth?.username?.charAt(0)}
                        </div>
                    )}
                    <div className="ml-3 overflow-hidden">
                        <p className="font-semibold text-sm capitalize text-white truncate">{auth?.username}</p>
                        <p className="text-xs text-slate-400">Voter</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg transition-all duration-200 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500">
                    <LogoutIcon className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </div>
        </aside>
    );
};


const VoterLayout = () => {
    return (
        <div className="flex bg-gray-50 font-sans">
            <VoterSidebar />
            <main className="flex-1 p-8 lg:p-12 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <Routes>
                    <Route path="dashboard" element={<VoterDashboardPage />} />
                    <Route path="elections" element={<ActiveElectionsPage />} />
                    <Route path="results" element={<VoteResultsPage />} />
                    <Route path="profile" element={<VoterProfilePage />} />
                    <Route index element={<VoterDashboardPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default VoterLayout;
