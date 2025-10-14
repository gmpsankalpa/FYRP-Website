import { useState, useEffect } from 'react';
import styles from './FAQ.module.css';
import usePageTitle from '../hooks/usePageTitle';

const FAQ = () => {
    // Set page title
    usePageTitle('FAQ');

    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Load Font Awesome
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
        document.head.appendChild(link);
    }, []);

    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const faqData = [
        {
            id: 1,
            category: 'general',
            question: 'What is the Smart Energy Meter project?',
            answer: 'The Smart Energy Meter is a Final Year Research Project (FYRP) that provides real-time monitoring of electrical energy consumption. It includes a mobile app, web dashboard, hardware simulation, and AI-powered analytics to help users track and optimize their energy usage.'
        },
        {
            id: 2,
            category: 'general',
            question: 'Who developed this project?',
            answer: 'This project was developed by Sankalpa Gamage as a Final Year Research Project at university. It combines IoT technology, web development, mobile app development, and AI/ML to create a comprehensive energy monitoring solution.'
        },
        {
            id: 3,
            category: 'general',
            question: 'Is this project open source?',
            answer: 'Yes! All components of the Smart Energy Meter project are open source and available on GitHub. You can find the source code for the mobile app, web dashboard, hardware simulation, and AI model in our SourceCode section.'
        },
        {
            id: 4,
            category: 'features',
            question: 'What features does the mobile app offer?',
            answer: 'The mobile app provides real-time energy monitoring, usage history, bill estimation, device control, push notifications for alerts, detailed analytics, energy-saving tips, and offline mode support. Available for both Android and iOS platforms.'
        },
        {
            id: 5,
            category: 'features',
            question: 'What can I do with the web dashboard?',
            answer: 'The web dashboard offers comprehensive energy monitoring with interactive charts, real-time data visualization, historical analysis, CSV/PDF export functionality, system control panel, and multi-device management. It\'s built with React.js and Firebase for real-time updates.'
        },
        {
            id: 6,
            category: 'features',
            question: 'Does the system support AI-powered analytics?',
            answer: 'Yes! The AI model uses machine learning (Python, TensorFlow, Scikit-learn) to provide predictive analytics, anomaly detection, usage pattern recognition, cost optimization suggestions, and load forecasting to help you make informed energy decisions.'
        },
        {
            id: 7,
            category: 'technical',
            question: 'What hardware is required for the energy meter?',
            answer: 'The hardware setup uses Arduino/ESP32 microcontroller, current sensors (ACS712/SCT-013), voltage sensors, LCD display, WiFi module for connectivity, and power supply components. Detailed schematics and parts list are available in the Hardware Simulation repository.'
        },
        {
            id: 8,
            category: 'technical',
            question: 'What technologies are used in this project?',
            answer: 'The project uses a modern tech stack including React Native (mobile), React.js (web), Firebase (backend/database), Arduino/ESP32 (hardware), Python with TensorFlow (AI/ML), Chart.js (data visualization), and various IoT protocols for communication.'
        },
        {
            id: 9,
            category: 'technical',
            question: 'How does the system ensure data security?',
            answer: 'Security measures include Firebase Authentication for user access, encrypted data transmission, secure API endpoints, role-based access control, regular security updates, and compliance with data protection standards. User data is stored securely in Firebase Firestore.'
        },
        {
            id: 10,
            category: 'setup',
            question: 'How do I set up the mobile app?',
            answer: 'Download the app from the Download page, install it on your device, create an account, connect your smart meter hardware via WiFi, and start monitoring. Detailed setup guides with screenshots are available in the app and on the website.'
        },
        {
            id: 11,
            category: 'setup',
            question: 'Can I use this without the hardware?',
            answer: 'Yes! You can explore the mobile app and web dashboard using demo mode with simulated data. This is perfect for testing features, understanding the interface, and evaluating the system before building the hardware.'
        },
        {
            id: 12,
            category: 'setup',
            question: 'How do I connect multiple devices?',
            answer: 'The web dashboard supports multi-device management. After setting up your first device, go to the dashboard, click "Add Device," enter the device ID, configure settings, and you can monitor all devices from a single interface with individual or combined views.'
        },
        {
            id: 13,
            category: 'support',
            question: 'Where can I get help if I encounter issues?',
            answer: 'For support, visit the Contact page to reach out via email, check the ChangeLog for known issues and fixes, browse GitHub Issues for community support, or review the documentation in each repository. Response time is typically 24-48 hours.'
        },
        {
            id: 14,
            category: 'support',
            question: 'Can I contribute to the project?',
            answer: 'Absolutely! Contributions are welcome. You can fork the repositories on GitHub, make improvements, submit pull requests, report bugs, suggest features, or improve documentation. Check the Contributing guidelines in each repository for details.'
        },
        {
            id: 15,
            category: 'support',
            question: 'Is there a community forum or Discord?',
            answer: 'Currently, discussions happen primarily on GitHub Issues and Discussions. For direct communication, you can reach out via the Contact page. We\'re considering setting up a Discord server based on community interest.'
        },
        {
            id: 16,
            category: 'pricing',
            question: 'Is the software free to use?',
            answer: 'Yes! All software components (mobile app, web dashboard, AI models) are completely free and open source under MIT license. You only need to cover costs for hardware components if you build the physical meter.'
        },
        {
            id: 17,
            category: 'pricing',
            question: 'What are the hardware costs?',
            answer: 'Hardware costs vary by region but typically range from $30-50 USD for all components (Arduino/ESP32, sensors, display, power supply). Exact part recommendations and suppliers are listed in the Hardware Simulation repository.'
        },
        {
            id: 18,
            category: 'pricing',
            question: 'Are there any subscription fees?',
            answer: 'No subscription fees! The project uses Firebase\'s free tier for most users. If you exceed Firebase free limits (rare for individual users), you may need to upgrade your Firebase plan, but the software itself remains free and open source.'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Questions', icon: 'fa-list' },
        { id: 'general', name: 'General', icon: 'fa-info-circle' },
        { id: 'features', name: 'Features', icon: 'fa-star' },
        { id: 'technical', name: 'Technical', icon: 'fa-code' },
        { id: 'setup', name: 'Setup', icon: 'fa-wrench' },
        { id: 'support', name: 'Support', icon: 'fa-headset' },
        { id: 'pricing', name: 'Pricing', icon: 'fa-dollar-sign' }
    ];

    const filteredFAQs = selectedCategory === 'all' 
        ? faqData 
        : faqData.filter(faq => faq.category === selectedCategory);

    const getCategoryColor = (category) => {
        const colors = {
            general: '#3498db',
            features: '#9b59b6',
            technical: '#e74c3c',
            setup: '#2ecc71',
            support: '#f39c12',
            pricing: '#1abc9c'
        };
        return colors[category] || '#ffe066';
    };

    return (
        <main>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1><span className={styles.highlight}>Frequently</span> Asked Questions</h1>
                    <p className={styles.heroDesc}>Find answers to common questions about the Smart Energy Meter project, its features, setup, and support.</p>
                </div>
                <div className={styles.heroImage}>
                    <img 
                        src={require('../assets/logo.png')} 
                        alt="Smart Meter Logo" 
                        loading="lazy"
                        decoding="async"
                        style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} 
                        onError={e => e.target.style.display = 'none'} 
                    />
                </div>
            </section>

            {/* Category Filter */}
            <section className={styles.categorySection}>
                <div className={styles.categoryContainer}>
                    <h2>Browse by Category</h2>
                    <div className={styles.categoryButtons}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <i className={`fas ${cat.icon}`}></i>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className={styles.faqSection}>
                <div className={styles.faqContainer}>
                    <div className={styles.faqList}>
                        {filteredFAQs.map(faq => (
                            <div key={faq.id} className={styles.faqItem}>
                                <div 
                                    className={styles.faqQuestion}
                                    onClick={() => toggleFAQ(faq.id)}
                                    style={{ borderLeftColor: getCategoryColor(faq.category) }}
                                >
                                    <div className={styles.questionContent}>
                                        <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryColor(faq.category) }}>
                                            {faq.category}
                                        </div>
                                        <h3>{faq.question}</h3>
                                    </div>
                                    <button className={styles.toggleBtn}>
                                        <i className={`fas fa-chevron-${expandedFAQ === faq.id ? 'up' : 'down'}`}></i>
                                    </button>
                                </div>
                                {expandedFAQ === faq.id && (
                                    <div className={styles.faqAnswer}>
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className={styles.quickLinksSection}>
                <div className={styles.quickLinksContainer}>
                    <h2>Still Have Questions?</h2>
                    <p className={styles.quickLinksDesc}>Can't find what you're looking for? Here are some helpful resources.</p>
                    <div className={styles.quickLinksGrid}>
                        <div className={styles.quickLinkCard}>
                            <i className="fas fa-envelope"></i>
                            <h3>Contact Support</h3>
                            <p>Get in touch with our support team for personalized assistance.</p>
                            <a href="/contact" className={styles.linkBtn}>Contact Us <i className="fas fa-arrow-right"></i></a>
                        </div>
                        <div className={styles.quickLinkCard}>
                            <i className="fas fa-code-branch"></i>
                            <h3>GitHub Repositories</h3>
                            <p>Explore the source code, documentation, and community discussions.</p>
                            <a href="/sourcecode" className={styles.linkBtn}>View Code <i className="fas fa-arrow-right"></i></a>
                        </div>
                        <div className={styles.quickLinkCard}>
                            <i className="fas fa-download"></i>
                            <h3>Get Started</h3>
                            <p>Download the mobile app and start monitoring your energy usage today.</p>
                            <a href="/download" className={styles.linkBtn}>Download App <i className="fas fa-arrow-right"></i></a>
                        </div>
                        <div className={styles.quickLinkCard}>
                            <i className="fas fa-history"></i>
                            <h3>ChangeLog</h3>
                            <p>Check out the latest updates, features, and bug fixes.</p>
                            <a href="/changelog" className={styles.linkBtn}>View Changes <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FAQ;
