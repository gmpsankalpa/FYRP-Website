import { Link } from 'react-router-dom';
import styles from './Error404.module.css';
import usePageTitle from '../hooks/usePageTitle';

const Error404 = () => {
    // Set page title
    usePageTitle('404 - Page Not Found');

    return (
        <div className={styles.errorPage}>
            <main>
                {/* 404 Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1><span className={styles.highlight}>Energy</span> Lost in Transmission</h1>
                        <p className={styles.heroDesc}>
                            The page you're looking for seems to have experienced a power outage. 
                            Don't worry - we'll help you get back on track.
                        </p>
                        
                        <div className={styles.heroActions}>
                            <Link to="/" className={styles.ctaBtn}>
                                <i className="fas fa-home"></i>
                                Return to Home
                            </Link>
                            <Link to="/download" className={styles.secondaryBtn}>
                                <i className="fas fa-download"></i>
                                Download App
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        <div className={styles.heroIcon}>
                            <span className={styles.heroNumber}>404</span>
                        </div>
                        <div className={styles.powerOutageAnimation}>
                            <div className={styles.energyWave}></div>
                            <div className={styles.energyWave}></div>
                            <div className={styles.energyWave}></div>
                        </div>
                    </div>
                </section>

                {/* Quick Links Section */}
                <section className={styles.quickLinks}>
                    <h2>Maybe You Were Looking For:</h2>
                    <div className={styles.linksGrid}>
                        <Link to="/" className={styles.linkCard}>
                            <div className={styles.linkIcon}>
                                <i className="fas fa-home"></i>
                            </div>
                            <div className={styles.linkContent}>
                                <h3>Home Dashboard</h3>
                                <p>Return to the main energy monitoring dashboard</p>
                            </div>
                        </Link>
                        
                        <Link to="/download" className={styles.linkCard}>
                            <div className={styles.linkIcon}>
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <div className={styles.linkContent}>
                                <h3>Download App</h3>
                                <p>Get the Smart Energy Meter mobile application</p>
                            </div>
                        </Link>

                        <Link to="/login" className={styles.linkCard}>
                            <div className={styles.linkIcon}>
                                <i className="fas fa-user"></i>
                            </div>
                            <div className={styles.linkContent}>
                                <h3>Login</h3>
                                <p>Access your energy monitoring account</p>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Energy Tips Section */}
                <section className={styles.energyTips}>
                    <h2>While You're Here, Save Some Energy!</h2>
                    <div className={styles.tipsGrid}>
                        <div className={styles.tipCard}>
                            <div className={styles.tipIcon}>
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h3>Switch to LED</h3>
                            <p>LED bulbs use 75% less energy than traditional incandescent bulbs</p>
                        </div>
                        
                        <div className={styles.tipCard}>
                            <div className={styles.tipIcon}>
                                <i className="fas fa-thermometer-half"></i>
                            </div>
                            <h3>Optimize Temperature</h3>
                            <p>Adjust your thermostat by 1°C can save up to 10% on energy bills</p>
                        </div>
                        
                        <div className={styles.tipCard}>
                            <div className={styles.tipIcon}>
                                <i className="fas fa-plug"></i>
                            </div>
                            <h3>Unplug Devices</h3>
                            <p>Standby power can account for 5-10% of residential energy use</p>
                            </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Error404;