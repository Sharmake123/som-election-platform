import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, UserGroupIcon, StarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../../context/LanguageContext';

// Icon mapping component
const Icon = ({ name, className }) => {
    const icons = {
        ShieldCheckIcon: <ShieldCheckIcon className={className} />,
        UserGroupIcon: <UserGroupIcon className={className} />,
        StarIcon: <StarIcon className={className} />,
        ArrowTrendingUpIcon: <ArrowTrendingUpIcon className={className} />,
    };
    return icons[name] || null;
};

const AboutPage = () => {
    const { t: translate } = useTranslation();
    const t = translate('aboutUs') || {}; // Scope translations to the 'aboutUs' section

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Hero Section */}
            <header className="bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        {t.hero?.title}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                        {t.hero?.subtitle}
                    </p>
                </div>
            </header>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">{t.mission?.heading}</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            {t.mission?.title}
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                            {t.mission?.description}
                        </p>
                    </div>
                </div>
            </section>
            
            {/* Values Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">{t.values?.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {t.values?.items.map((value) => (
                    <div key={value.title} className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
                       <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                            <Icon name={value.icon} className="h-6 w-6" />
                          </div>
                        </div>
                      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{value.title}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.team?.title}</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">{t.team?.subtitle}</p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t.team?.members.map((member) => (
                            <div key={member.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 text-center">
                                <img
                                    className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-white dark:ring-gray-700"
                                    src={member.imageUrl}
                                    alt={member.name}
                                />
                                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold">{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600">
                <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        {t.cta?.title}
                    </h2>
                    <div className="mt-8 flex justify-center">
                        <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300">
                           {t.cta?.button}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
