import { useEffect } from 'react';
import styles from './PrivacyPolicy.module.css';
import usePageTitle from '../hooks/usePageTitle';

const PrivacyPolicy = () => {
    // Set page title
    usePageTitle('Privacy Policy');

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
                    <h1><span className={styles.highlight}>Privacy</span> Policy</h1>
                    <p className={styles.heroDesc}>Your privacy is important to us. We are finalizing our comprehensive privacy policy.</p>
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
            <section className={styles.comingSoon}>
                <div className={styles.container}>
                    <div className={styles.comingSoonCard}>
                        <div className={styles.iconWrapper}>
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h2>Privacy Policy Update Coming Soon</h2>
                        <p className={styles.mainMessage}>
                            We are currently finalizing our comprehensive privacy policy to ensure it meets the highest standards of transparency and data protection.
                        </p>
                        <div className={styles.statusBadge}>
                            <i className="fas fa-clock"></i>
                            <span>Under Development</span>
                        </div>
                    </div>

                    {/* What We're Working On */}
                    <div className={styles.featuresGrid}>
                        <h3 className={styles.sectionTitle}>What Our Privacy Policy Will Cover</h3>
                        <div className={styles.featureCards}>
                            <div className={styles.featureCard}>
                                <i className="fas fa-database"></i>
                                <h4>Data Collection</h4>
                                <p>Clear information about what data we collect and why</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-lock"></i>
                                <h4>Data Security</h4>
                                <p>How we protect and secure your personal information</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-user-check"></i>
                                <h4>Your Rights</h4>
                                <p>Your rights regarding your data and how to exercise them</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-share-nodes"></i>
                                <h4>Data Sharing</h4>
                                <p>Information about third-party data sharing practices</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-cookie-bite"></i>
                                <h4>Cookies & Tracking</h4>
                                <p>How we use cookies and tracking technologies</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-gavel"></i>
                                <h4>Legal Compliance</h4>
                                <p>Compliance with GDPR, CCPA, and other regulations</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className={styles.timeline}>
                        <div className={styles.timelineCard}>
                            <i className="fas fa-calendar-alt"></i>
                            <h4>Expected Publication</h4>
                            <p className={styles.timelineDate}>December 2025</p>
                            <p className={styles.timelineDesc}>We're working diligently to finalize our privacy policy</p>
                        </div>
                    </div>

                    {/* Temporary Commitment */}
                    <div className={styles.commitment}>
                        <h3 className={styles.sectionTitle}>Our Commitment to Your Privacy</h3>
                        <div className={styles.commitmentContent}>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Data Minimization</h4>
                                    <p>We collect only the data necessary for our service to function</p>
                                </div>
                            </div>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Transparency</h4>
                                    <p>We will be transparent about our data practices</p>
                                </div>
                            </div>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Security First</h4>
                                    <p>Your data is encrypted and stored securely using Firebase</p>
                                </div>
                            </div>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Your Control</h4>
                                    <p>You will have full control over your personal data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;
