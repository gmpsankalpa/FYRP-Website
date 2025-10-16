import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	
	return (
		<footer className={styles.modernFooter}>
			<div className={styles.footerContent}>
				{/* Desktop Extended Footer */}
				<div className={styles.footerExtended}>
					<div className={styles.footerColumn}>
						<div className={styles.footerLogo}>
							<img 
								src={require('../assets/logo.png')} 
								alt="Smart Energy Meter Logo" 
								loading="lazy"
								decoding="async"
								onError={e => e.target.style.display = 'none'} 
							/>
						</div>
						<h3>Smart Energy Meter</h3>
						<p className={styles.footerDesc}>
							Monitor and optimize your energy consumption with real-time insights and intelligent analytics.
						</p>
					</div>
					
					<div className={styles.footerColumn}>
						<h4>Quick Links</h4>
						<ul className={styles.footerLinks}>
							<li><Link to="/">Home</Link></li>
							<li><Link to="/about">About</Link></li>
							<li><Link to="/download">Download</Link></li>
							<li><Link to="/contact">Contact</Link></li>
							<li><Link to="/login">Login</Link></li>
							<li><Link to="/faq">FAQ</Link></li>
						</ul>
					</div>
					
					<div className={styles.footerColumn}>
						<h4>Resources</h4>
						<ul className={styles.footerLinks}>
							<li><Link to="/source">Source Code</Link></li>
							<li><Link to="/ai-model">AI Model</Link></li>
							<li><Link to="/change-log">Change Log</Link></li>
							<li><Link to="/help">Help Center</Link></li>
							<li><Link to="/status">System Status</Link></li>
							<li><Link to="/privacy">Privacy Policy</Link></li>
							<li><Link to="/terms">Terms of Service</Link></li>
						</ul>
					</div>
					
					<div className={styles.footerColumn}>
						<h4>Contact</h4>
						<ul className={styles.footerLinks}>
							<li><i className="fas fa-envelope"></i><a href="mailto:gmpsankalpa@gmail.com"> gmpsankalpa@gmail.com</a></li>
							<li><i className="fas fa-phone"></i><a href="tel:+94711887202"> +94 71 188 7202</a></li>
							<li><i className="fas fa-map-marker-alt"></i><a href="http://oluvil-sri-lanka.com"> Oluvil, Sri Lanka</a></li>
						</ul>
					</div>
				</div>
				
				{/* Mobile & Copyright */}
				<div className={styles.footerBottom}>
					<p>&copy; {currentYear} GMP Sankalpa. All Rights Reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
