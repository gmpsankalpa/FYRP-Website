import { useEffect } from 'react';
import styles from './HelpCenter.module.css';
import usePageTitle from '../hooks/usePageTitle';

const HelpCenter = () => {
    // Set page title
    usePageTitle('Help Center');

    // Load Font Awesome
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
        document.head.appendChild(link);
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1><span className={styles.highlight}>Help</span> Center</h1>
                    <p className={styles.heroDesc}>
                        Welcome to the Help Center. Here you can find answers to common questions and get support for your Smart Energy Meter.
                    </p>
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

            {/* Coming Soon Section */}
            <section className={styles.comingSoonSection}>
                <div className={styles.comingSoonContainer}>
                    <div className={styles.comingSoonContent}>
                        <div className={styles.iconWrapper}>
                            <i className="fas fa-tools"></i>
                        </div>
                        <h2>Help Center <span className={styles.badge}>Coming Soon</span></h2>
                        <p className={styles.description}>
                            We're working hard to bring you a comprehensive Help Center with detailed guides, tutorials, troubleshooting tips, and more!
                        </p>
                        
                        <div className={styles.featuresPreview}>
                            <h3>What's Coming:</h3>
                            <div className={styles.featuresList}>
                                <div className={styles.featureItem}>
                                    <i className="fas fa-book"></i>
                                    <div>
                                        <h4>Documentation</h4>
                                        <p>Complete guides for setup and usage</p>
                                    </div>
                                </div>
                                <div className={styles.featureItem}>
                                    <i className="fas fa-video"></i>
                                    <div>
                                        <h4>Video Tutorials</h4>
                                        <p>Step-by-step video instructions</p>
                                    </div>
                                </div>
                                <div className={styles.featureItem}>
                                    <i className="fas fa-life-ring"></i>
                                    <div>
                                        <h4>Troubleshooting</h4>
                                        <p>Solutions to common issues</p>
                                    </div>
                                </div>
                                <div className={styles.featureItem}>
                                    <i className="fas fa-comments"></i>
                                    <div>
                                        <h4>Community Forum</h4>
                                        <p>Connect with other users</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.timeline}>
                            <i className="fas fa-calendar-alt"></i>
                            <p>Expected Launch: <strong>December 2025</strong></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Temporary Resources Section */}
            <section className={styles.resourcesSection}>
                <div className={styles.resourcesContainer}>
                    <h2>In the Meantime</h2>
                    <p className={styles.resourcesDesc}>While we're building the Help Center, check out these helpful resources:</p>
                    
                    <div className={styles.resourcesGrid}>
                        <a href="/faq" className={styles.resourceCard}>
                            <i className="fas fa-question-circle"></i>
                            <h3>FAQ</h3>
                            <p>Find answers to frequently asked questions</p>
                            <span className={styles.arrow}>→</span>
                        </a>
                        
                        <a href="/contact" className={styles.resourceCard}>
                            <i className="fas fa-envelope"></i>
                            <h3>Contact Support</h3>
                            <p>Get in touch with our support team</p>
                            <span className={styles.arrow}>→</span>
                        </a>
                        
                        <a href="/sourcecode" className={styles.resourceCard}>
                            <i className="fas fa-code"></i>
                            <h3>GitHub Docs</h3>
                            <p>Browse technical documentation on GitHub</p>
                            <span className={styles.arrow}>→</span>
                        </a>
                        
                        <a href="/download" className={styles.resourceCard}>
                            <i className="fas fa-download"></i>
                            <h3>Getting Started</h3>
                            <p>Download the app and start monitoring</p>
                            <span className={styles.arrow}>→</span>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HelpCenter;
