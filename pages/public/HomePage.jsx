import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, InfoIcon, ShieldCheckIcon, UserGroupIcon } from '../../components/icons';
import api, { API_BASE_URL } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';

const HomePage = () => {
    const [candidates, setCandidates] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchShowcaseCandidates = async () => {
            try {
                const { data } = await api.get('/candidates/showcase');
                setCandidates(data);
            } catch (error) {
                console.error("Could not fetch showcase candidates", error);
            }
        };
        fetchShowcaseCandidates();
    }, []);

    const features = [
        { title: t('feature1Title'), description: t('feature1Desc'), icon: <ShieldCheckIcon className="w-10 h-10 text-brand-blue"/> },
        { title: t('feature2Title'), description: t('feature2Desc'), icon: <InfoIcon className="w-10 h-10 text-brand-blue"/> },
        { title: t('feature3Title'), description: t('feature3Desc'), icon: <CheckCircleIcon className="w-10 h-10 text-brand-blue"/> },
    ];
    
    const testimonials = [
        { name: 'Axmed Cali', role: 'Musharax Madaxweyne', quote: 'Platform-ka wuxuu bixiyaa hab casri ah oo lagu hubiyo in cod kasta la tiriyo.', avatar: 'AA' },
        { name: 'Fadumo Khaliif', role: 'U Doodaha Dimuqraadiyada', quote: 'Tani waa tillaabo weyn oo loo qaaday dhanka doorashooyin xor iyo xalaal ah.', avatar: 'FK' },
        { name: 'Maxamed Cabdi', role: 'Falanqeeye Siyaasadeed', quote: 'Adeegsiga tignoolajiyaddan waxay dhisi doontaa kalsoonida dadweynaha.', avatar: 'MC' },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="animate-fade-in-up">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-blue/20 border border-brand-blue/50 text-brand-light-blue text-sm font-semibold mb-6">
                            The Future of Democracy
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                            {t('heroTitle1')} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light-blue to-purple-400">
                                {t('heroTitle2')}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                            {t('heroSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                             <Link to="/register" className="px-8 py-4 bg-brand-blue text-white font-bold rounded-full hover:bg-brand-light-blue transition-all duration-300 shadow-lg hover:shadow-brand-blue/50 transform hover:-translate-y-1">
                                {t('startNow')}
                             </Link>
                             <Link to="/login" className="px-8 py-4 bg-transparent border border-gray-500 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                                {t('platformDemo')}
                             </Link>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </section>
            
            {/* Candidates Showcase Section */}
            <section className="py-24 bg-white dark:bg-gray-900 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('candidatesTitle')}</h2>
                        <div className="w-24 h-1 bg-brand-blue mx-auto rounded-full mb-4"></div>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('candidatesSubtitle')}</p>
                    </div>
                    
                    {candidates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {candidates.map((c, index) => (
                                <div key={c.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2">
                                    <div className="relative h-80 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        <img 
                                            src={`${API_BASE_URL.replace('/api', '')}/uploads/${c.photo}`} 
                                            alt={c.fullName} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-0 left-0 p-6 z-20">
                                            <span className="inline-block px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full mb-2">
                                                {c.party || 'Independent'}
                                            </span>
                                            <h3 className="text-2xl font-bold text-white mb-1">{c.fullName}</h3>
                                            <p className="text-gray-300 text-sm">{c.position || 'Presidential Candidate'}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                            {c.manifesto || "Dedicated to serving the people with integrity and vision for a better future."}
                                        </p>
                                        <Link to={`/candidate/${c.id}`} className="inline-flex items-center text-brand-blue font-semibold hover:text-brand-light-blue transition-colors">
                                            View Full Profile 
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <UserGroupIcon className="w-16 h-16 mx-auto text-gray-400 mb-4"/>
                            <p className="text-xl text-gray-500">{t('noCandidates') || "Candidates will be announced soon."}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('techTitle')}</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Built with cutting-edge technology to ensure the integrity of every vote.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
                                <div className="bg-brand-blue/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform rotate-3 group-hover:rotate-0 transition-transform">
                                   {f.icon}
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">{f.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
             {/* Testimonials Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-16">{t('testimonialsTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                                        {t.avatar}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-bold text-lg">{t.name}</h4>
                                        <p className="text-sm text-brand-light-blue">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic leading-relaxed">"{t.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
             {/* CTA Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-r from-brand-blue to-purple-600 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-pattern opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('ctaTitle')}</h2>
                            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{t('ctaSubtitle')}</p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                 <Link to="/register" className="px-8 py-4 bg-white text-brand-blue font-bold rounded-full hover:bg-gray-100 transition duration-300 shadow-lg">{t('startToday')}</Link>
                                 <a href="#" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition duration-300">{t('contactTeam')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
