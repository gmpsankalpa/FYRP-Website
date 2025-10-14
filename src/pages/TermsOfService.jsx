import { useEffect } from 'react';
import styles from './TermsOfService.module.css';
import usePageTitle from '../hooks/usePageTitle';

const TermsOfService = () => {
    // Set page title
    usePageTitle('Terms of Service');

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
                    <h1><span className={styles.highlight}>Terms</span> of Service</h1>
                    <p className={styles.heroDesc}>
                        Welcome to Smart Energy Meter. We are finalizing our comprehensive terms of service.
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
            <section className={styles.comingSoon}>
                <div className={styles.container}>
                    <div className={styles.comingSoonCard}>
                        <div className={styles.iconWrapper}>
                            <i className="fas fa-file-contract"></i>
                        </div>
                        <h2>Terms of Service Update Coming Soon</h2>
                        <p className={styles.mainMessage}>
                            We are currently finalizing our comprehensive terms of service to ensure clarity and fairness for all users.
                        </p>
                        <div className={styles.statusBadge}>
                            <i className="fas fa-clock"></i>
                            <span>Under Development</span>
                        </div>
                    </div>

                    {/* What We're Working On */}
                    <div className={styles.featuresGrid}>
                        <h3 className={styles.sectionTitle}>What Our Terms of Service Will Cover</h3>
                        <div className={styles.featureCards}>
                            <div className={styles.featureCard}>
                                <i className="fas fa-handshake"></i>
                                <h4>User Agreement</h4>
                                <p>Clear terms governing your use of our services</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-user-shield"></i>
                                <h4>User Responsibilities</h4>
                                <p>Your obligations and responsibilities when using our platform</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-copyright"></i>
                                <h4>Intellectual Property</h4>
                                <p>Protection of copyrights, trademarks, and proprietary content</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-ban"></i>
                                <h4>Prohibited Activities</h4>
                                <p>Activities that are not permitted on our platform</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-shield-halved"></i>
                                <h4>Limitation of Liability</h4>
                                <p>Understanding the limits of our liability and warranties</p>
                            </div>
                            <div className={styles.featureCard}>
                                <i className="fas fa-scale-balanced"></i>
                                <h4>Dispute Resolution</h4>
                                <p>Procedures for resolving any disputes or conflicts</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className={styles.timeline}>
                        <div className={styles.timelineCard}>
                            <i className="fas fa-calendar-alt"></i>
                            <h4>Expected Publication</h4>
                            <p className={styles.timelineDate}>December 2025</p>
                            <p className={styles.timelineDesc}>We're working diligently to finalize our terms of service</p>
                        </div>
                    </div>

                    {/* Temporary Guidelines */}
                    <div className={styles.commitment}>
                        <h3 className={styles.sectionTitle}>Our Current Guidelines</h3>
                        <div className={styles.commitmentContent}>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Fair Use</h4>
                                    <p>Use our services responsibly and ethically</p>
                                </div>
                            </div>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Account Security</h4>
                                    <p>Maintain the security of your account credentials</p>
                                </div>
                            </div>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Accurate Information</h4>
                                    <p>Provide truthful and accurate information</p>
                                </div>
                            </div>
                            <div className={styles.commitmentItem}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <h4>Respect Others</h4>
                                    <p>Be respectful to other users and our support team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );  
};

export default TermsOfService;