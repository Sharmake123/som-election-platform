import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../../utils/api';
import { FullPageSpinner } from '../../utils/Spinner';
import { useTranslation } from '../../context/LanguageContext';

const CandidateDetailsPage = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const { data } = await api.get(`/candidates/${id}`);
                setCandidate(data);
            } catch (err) {
                console.error("Failed to fetch candidate details", err);
                setError("Candidate not found or server error.");
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    if (loading) return <FullPageSpinner />;

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{error}</p>
                    <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-brand-light-blue transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!candidate) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link to="/" className="text-brand-blue hover:text-brand-light-blue font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Home
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative h-64 sm:h-80 bg-brand-blue">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-purple-600 opacity-90"></div>
                        <div className="absolute -bottom-16 left-8 sm:left-12">
                            <img 
                                src={`${API_BASE_URL.replace('/api', '')}/uploads/${candidate.photo}`} 
                                alt={candidate.fullName} 
                                className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-2xl"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-20 pb-12 px-8 sm:px-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{candidate.fullName}</h1>
                                <p className="text-xl text-brand-blue font-semibold">{candidate.position || 'Presidential Candidate'}</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {candidate.Election?.name || 'General Election'}
                                </span>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Biography & Manifesto</h3>
                            <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed text-lg">
                                {candidate.bio || candidate.manifesto || "No detailed biography available."}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact & Social</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    {candidate.email}
                                </div>
                                {/* Add more social links if available in model */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailsPage;
