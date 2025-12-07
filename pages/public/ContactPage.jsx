import React, { useContext } from 'react';
import { ToastContext } from '../../App';
import { useTranslation } from '../../context/LanguageContext';
import api from '../../utils/api';

const ContactPage = () => {
    const { showToast } = useContext(ToastContext);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.post('/messages', data);
            showToast("Thank you for your message! We will get back to you soon.", "success");
            e.target.reset();
        } catch (error) {
            showToast("Failed to send message. Please try again.", "error");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto lg:max-w-none">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">{t.contactTitle}</h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                        {t.contactSubtitle}
                    </p>
                </div>
                <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-1">
                        <div className="text-gray-500 dark:text-gray-400">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.contactInfoTitle}</h3>
                            <p className="mt-2">{t.contactInfoDesc}</p>
                            <p className="mt-6"><strong>{t.contactPhone}</strong> +252 61 000 0000</p>
                            <p className="mt-2"><strong>{t.contactEmail}</strong> contact@som-election.so</p>
                            <p className="mt-2"><strong>{t.contactAddress}</strong> Maka Al-Mukarama Road, Mogadishu, Somalia</p>
                        </div>
                    </div>
                    <div className="mt-12 lg:mt-0 lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="sr-only">Full name</label>
                                <input type="text" name="name" id="name" required placeholder="Full name" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input id="email" name="email" type="email" required autoComplete="email" placeholder="Email" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="sr-only">Subject</label>
                                <input type="text" name="subject" id="subject" required placeholder="Subject" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea id="message" name="message" rows="4" required placeholder="Message" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:bg-brand-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;