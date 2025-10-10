import { useEffect } from 'react';
import styles from './Home.module.css';

const Home = () => {
	useEffect(() => {
		const faLink = document.createElement('link');
		faLink.rel = 'stylesheet';
		faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
		faLink.crossOrigin = 'anonymous';
		document.head.appendChild(faLink);
		return () => {
			document.head.removeChild(faLink);
		};
	}, []);

	return (
		<main>
		{/* Hero Section */}
		<section className={styles.hero}>
			<div className={styles.heroContent}>
				<h1><span className={styles.highlight}>Monitor</span> Your Energy, <span className={styles.highlight}>Empower</span> Your Future</h1>
				<p className={styles.heroDesc}>Experience real-time energy tracking, instant alerts, and smart analytics with the next-generation Smart Energy Meter.</p>
			</div>
			<div className={styles.heroImage}>
				<img src={require('../assets/logo.png')} alt="Smart Meter Logo" style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} onError={e => e.target.style.display = 'none'} />
			</div>
		</section>

		{/* Technical Overview Section */}
		<section className={styles.technicalOverview}>
			<div className={styles.technicalContent}>
				<h2>Advanced IoT Energy Management System</h2>
				<div className={styles.technicalGrid}>
					<div className={styles.techCard}>
						<div className={styles.techIcon}><i className="fas fa-microchip"></i></div>
						<div className={styles.techInfo}>
							<h3>Arduino & ESP32 Powered</h3>
							<p>Utilizes affordable Arduino microcontroller and ESP32 Wi-Fi module for real-time electrical parameter measurement and secure cloud transmission.</p>
						</div>
					</div>
					<div className={styles.techCard}>
						<div className={styles.techIcon}><i className="fas fa-shield-alt"></i></div>
						<div className={styles.techInfo}>
							<h3>Advanced Theft Detection</h3>
							<p>Analyzes consumption patterns and compares mainline vs. household readings to detect tampering or unauthorized usage with instant alerts.</p>
						</div>
					</div>
					<div className={styles.techCard}>
						<div className={styles.techIcon}><i className="fas fa-chart-line"></i></div>
						<div className={styles.techInfo}>
							<h3>Smart Analytics</h3>
							<p>Provides daily energy usage reports, consumption trends, and actionable insights for optimizing power consumption.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		{/* Features Section */}
		<section className={styles.featuresModern}>
			<h2>Why Choose Smart Energy Meter?</h2>
			<div className={styles.featuresGrid}>
				<div className={styles.featureCard}><span className={styles.featureIcon}>⚡</span><h3>Live Monitoring</h3><p>Track voltage, current, and power in real time with beautiful graphs and instant updates.</p></div>
				<div className={styles.featureCard}><span className={styles.featureIcon}>🚨</span><h3>Energy Theft Detection</h3><p>Receive alerts for any unusual activity or tampering with your energy meter.</p></div>
				<div className={styles.featureCard}><span className={styles.featureIcon}>🔔</span><h3>Instant Alerts</h3><p>Get notified immediately about irregularities or system issues to stay in control.</p></div>
				<div className={styles.featureCard}><span className={styles.featureIcon}>📊</span><h3>Analytics & Trends</h3><p>Visualize your energy usage history and discover ways to optimize consumption.</p></div>
				<div className={styles.featureCard}><span className={styles.featureIcon}>🛠️</span><h3>Remote Control</h3><p>Switch your system on/off from anywhere using the app or web dashboard.</p></div>
			</div>
		</section>

		{/* System Architecture Section */}
		<section className={styles.architectureSection}>
			<div className={styles.architectureContent}>
				<h2>System Architecture & Innovation</h2>
				<div className={styles.architectureInfo}>
					<div className={styles.architectureText}>
						<h3>Modular & Cost-Effective Design</h3>
						<p>Our system is designed to be modular and affordable, making it suitable for typical households while providing commercial-grade features at a fraction of the cost.</p>
						<h3>Single-Phase Residential Focus</h3>
						<p>Specifically optimized for single-phase residential power systems, ensuring accurate monitoring and control for home energy management.</p>
						<h3>Future-Ready Platform</h3>
						<p>Built with expansion in mind - ready for integration with smart meters, renewable energy sources, and AI-based predictive analytics.</p>
					</div>
					<div className={styles.architectureVisual}>
						<div className={styles.architectureDiagram}>
							<div className={`${styles.diagramItem} ${styles.sensor}`}>Voltage & Current Sensors</div>
							<div className={styles.diagramArrow}>↓</div>
							<div className={`${styles.diagramItem} ${styles.arduino}`}>Arduino Microcontroller</div>
							<div className={styles.diagramArrow}>↓</div>
							<div className={`${styles.diagramItem} ${styles.esp32}`}>ESP32 Wi-Fi Module</div>
							<div className={styles.diagramArrow}>↓</div>
							<div className={`${styles.diagramItem} ${styles.cloud}`}>Cloud Database & Analytics</div>
							<div className={styles.diagramArrow}>↓</div>
							<div className={`${styles.diagramItem} ${styles.dashboard}`}>User Dashboard & Mobile App</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		{/* App Download Section */}
		<section className={styles.downloadModern}>
			<div className={styles.downloadContent}>
				<h2>Download the App</h2>
				<p>Take charge of your energy usage. Download the Smart Energy Meter app for Android now!</p>
				<a href="/assets/app/app-release.apk" className={styles.downloadBtnModern} download>Download APK</a>
			</div>
			<div className={styles.downloadImage}>
				<img src={require('../assets/app_icon.png')} alt="App Icon" style={{ maxWidth: 100, background: '#fff', borderRadius: 16 }} onError={e => e.target.style.display = 'none'} />
			</div>
		</section>

		{/* Benefits Section */}
		<section className={styles.benefitsSection}>
			<h2>Key Benefits & Impact</h2>
			<div className={styles.benefitsGrid}>
				<div className={styles.benefitCard}><div className={styles.benefitIcon}><i className="fas fa-leaf"></i></div><h3>Sustainable Energy Practices</h3><p>Promote eco-friendly energy consumption through detailed monitoring and optimization suggestions.</p></div>
				<div className={styles.benefitCard}><div className={styles.benefitIcon}><i className="fas fa-eye"></i></div><h3>Enhanced Transparency</h3><p>Gain complete visibility into your energy usage patterns and identify areas for improvement.</p></div>
				<div className={styles.benefitCard}><div className={styles.benefitIcon}><i className="fas fa-money-bill-wave"></i></div><h3>Cost Savings</h3><p>Reduce electricity bills by identifying and eliminating wasteful energy consumption.</p></div>
				<div className={styles.benefitCard}><div className={styles.benefitIcon}><i className="fas fa-home"></i></div><h3>Home Security</h3><p>Protect your property with advanced theft detection that alerts you to unauthorized usage.</p></div>
			</div>
		</section>

		{/* Video Section */}
		<section className={styles.videoModern}>
			<h2>See It In Action</h2>
			<div className={styles.videoContainer}>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/tspb05mH19I" title="Smart Energy Meter Demo Video" frameBorder="0" allowFullScreen></iframe>
			</div>
		</section>

		{/* About Section */}
		<section className={styles.aboutModern}>
			<h2>About Smart Energy Meter</h2>
			<p>The Smart Energy Meter is a modern solution built with Flutter and Firebase, designed to help you monitor, analyze, and optimize your energy consumption with ease and style.</p>
			<p className={styles.projectContext}>This Final Year Project represents an innovative approach to residential energy management, combining affordable hardware with sophisticated software to deliver commercial-grade features at an accessible price point. The system addresses the growing need for efficient and secure energy usage in modern households.</p>
		</section>

		{/* Social Media Section */}
		<section className={styles.socialModern}>
			<h2>Connect with the Developer</h2>
			<div className={styles.socialIcons}>
				<a href="https://github.com/gmpsankalpa" target="_blank" title="GitHub" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
				<a href="https://linkedin.com/in/gmpsankalpa" target="_blank" title="LinkedIn" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
				<a href="https://twitter.com/gmpsankalpa" target="_blank" title="Twitter" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
				<a href="https://facebook.com/gmpsankalpa" target="_blank" title="Facebook" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
			</div>
			<p className={styles.devCredit}>Developed by <strong>GMP Sankalpa</strong> | Final Year Project</p>
		</section>
			</main>
		);
	};

	export default Home;
