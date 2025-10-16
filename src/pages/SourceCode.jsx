import { useEffect, useState } from 'react';
import styles from './SourceCode.module.css';
import usePageTitle from '../hooks/usePageTitle';
import { SkeletonCard } from '../components/SkeletonLoader';

const SourceCode = () => {
	// Set page title
	usePageTitle('Source Code');
	
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		// Load Font Awesome
		const faLink = document.createElement('link');
		faLink.rel = 'stylesheet';
		faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
		faLink.crossOrigin = 'anonymous';
		document.head.appendChild(faLink);
		
		// Set initial load to false after a short delay
		const timer = setTimeout(() => {
			setIsInitialLoad(false);
		}, 800);
		
		return () => {
			document.head.removeChild(faLink);
			clearTimeout(timer);
		};
	}, []);

	const repositories = [
		{
			id: 1,
			name: 'Smart Energy Meter - Mobile App',
			description: 'Android mobile application for real-time energy monitoring, analytics, and remote control of the Smart Energy Meter system.',
			icon: 'fa-mobile-alt',
			color: '#3ddc84',
			techStack: ['Flutter', 'Android Studio', 'Firebase', 'Material Design'],
			features: [
				'Real-time energy monitoring',
				'Push notifications for alerts',
				'Interactive charts and analytics',
				'Remote system control'
			],
			githubUrl: 'https://github.com/gmpsankalpa/smart_energy_meter',
			stats: {
				language: 'Java',
				size: '~50 MB'
			}
		},
		{
			id: 2,
			name: 'Smart Energy Meter - Web Dashboard',
			description: 'React-based web dashboard providing comprehensive energy monitoring, data visualization, and system management capabilities.',
			icon: 'fa-desktop',
			color: '#61dafb',
			techStack: ['React', 'JavaScript', 'Firebase', 'Chart.js'],
			features: [
				'Responsive web interface',
				'Real-time data visualization',
				'Advanced analytics and reporting',
				'User authentication and profiles'
			],
			githubUrl: 'https://github.com/gmpsankalpa/FYRP-Website',
			stats: {
				language: 'JavaScript',
				size: 'React App'
			}
		},
		{
			id: 3,
			name: 'Smart Energy Meter - Hardware Simulation',
			description: 'Arduino/ESP-based hardware simulation code for energy meter sensors, data collection, and IoT communication protocols.',
			icon: 'fa-microchip',
			color: '#00979d',
			techStack: ['Arduino', 'C++', 'ESP8266/ESP32', 'IoT'],
			features: [
				'Sensor data acquisition',
				'Real-time power calculations',
				'WiFi/Bluetooth connectivity',
				'Firebase integration'
			],
			githubUrl: 'https://github.com/gmpsankalpa/FYRP-Simulation',
			stats: {
				language: 'C++',
				size: 'Arduino/ESP'
			}
		},
		{
			id: 4,
			name: 'Smart Energy Meter - AI Model',
			description: 'Machine learning models for energy consumption prediction, anomaly detection, and intelligent power usage optimization.',
			icon: 'fa-brain',
			color: '#ff6f00',
			techStack: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas'],
			features: [
				'Energy consumption forecasting',
				'Anomaly detection algorithms',
				'Usage pattern analysis',
				'Optimization recommendations'
			],
			githubUrl: 'https://github.com/gmpsankalpa/Smart-Energy-Meter-AI',
			stats: {
				language: 'Python',
				size: 'ML Model'
			}
		}
	];

	return (
        <main>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1><span className={styles.highlight}>Open </span>Source Repositories</h1>
                    <p className={styles.heroDesc}>Explore the complete Smart Energy Meter ecosystem. Access our mobile app, web dashboard, hardware simulation, and AI model repositories on GitHub.</p>
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

			{/* Repositories Section */}
			<section className={styles.repositoriesSection}>
				<h2>Project Repositories</h2>
				<p className={styles.sectionSubtitle}>
					Our Smart Energy Meter project is built with multiple components working together seamlessly. 
					Explore each repository to understand the complete architecture.
				</p>

				{isInitialLoad ? (
					<div className={styles.reposGrid}>
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
				) : (
				<div className={styles.reposGrid}>
					{repositories.map((repo) => (
						<div key={repo.id} className={styles.repoCard}>
							<div className={styles.repoHeader}>
								<div className={styles.repoIcon} style={{ color: repo.color }}>
									<i className={`fas ${repo.icon}`}></i>
								</div>
								<div className={styles.repoStats}>
									<span className={styles.languageBadge} style={{ borderColor: repo.color }}>
										<i className="fas fa-circle" style={{ color: repo.color }}></i>
										{repo.stats.language}
									</span>
								</div>
							</div>

							<div className={styles.repoContent}>
								<h3>{repo.name}</h3>
								<p className={styles.repoDescription}>{repo.description}</p>

								<div className={styles.techStack}>
									<h4>Tech Stack:</h4>
									<div className={styles.techTags}>
										{repo.techStack.map((tech, index) => (
											<span key={index} className={styles.techTag}>{tech}</span>
										))}
									</div>
								</div>

								<div className={styles.features}>
									<h4>Key Features:</h4>
									<ul>
										{repo.features.map((feature, index) => (
											<li key={index}>
												<i className="fas fa-check-circle"></i>
												{feature}
											</li>
										))}
									</ul>
								</div>
							</div>

							<div className={styles.repoFooter}>
								<a 
									href={repo.githubUrl} 
									target="_blank" 
									rel="noopener noreferrer" 
									className={styles.githubButton}
									style={{ borderColor: repo.color }}
								>
									<i className="fab fa-github"></i>
									View on GitHub
								</a>
								<div className={styles.repoMeta}>
									<span><i className="fas fa-code-branch"></i> {repo.stats.size}</span>
								</div>
							</div>
						</div>
					))}
				</div>
				)}
			</section>

			{/* Getting Started Section */}
			<section className={styles.gettingStarted}>
				<h2>Getting Started</h2>
				<div className={styles.stepsGrid}>
					<div className={styles.stepCard}>
						<div className={styles.stepNumber}>1</div>
						<div className={styles.stepContent}>
							<h3>Clone Repository</h3>
							<p>Choose the repository you want to work with and clone it to your local machine.</p>
							<code>git clone https://github.com/gmpsankalpa/[repo-name].git</code>
						</div>
					</div>

					<div className={styles.stepCard}>
						<div className={styles.stepNumber}>2</div>
						<div className={styles.stepContent}>
							<h3>Install Dependencies</h3>
							<p>Follow the installation instructions in the README file of each repository.</p>
							<code>npm install / pip install -r requirements.txt</code>
						</div>
					</div>

					<div className={styles.stepCard}>
						<div className={styles.stepNumber}>3</div>
						<div className={styles.stepContent}>
							<h3>Configure Environment</h3>
							<p>Set up your environment variables and configuration files as specified in the docs.</p>
							<code>cp .env.example .env</code>
						</div>
					</div>

					<div className={styles.stepCard}>
						<div className={styles.stepNumber}>4</div>
						<div className={styles.stepContent}>
							<h3>Start Development</h3>
							<p>Run the development server or build the project according to the repository guidelines.</p>
							<code>npm start / python main.py</code>
						</div>
					</div>
				</div>
			</section>

			{/* Contribution Section */}
			<section className={styles.contributionSection}>
				<div className={styles.contributionContent}>
					<div className={styles.contributionText}>
						<h2>Contribute to the Project</h2>
						<p>We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements, your help makes this project better.</p>
						<ul className={styles.contributionList}>
							<li><i className="fas fa-code"></i> Submit pull requests</li>
							<li><i className="fas fa-bug"></i> Report issues and bugs</li>
							<li><i className="fas fa-book"></i> Improve documentation</li>
							<li><i className="fas fa-lightbulb"></i> Suggest new features</li>
						</ul>
					</div>
					<div className={styles.contributionActions}>
						<a href="https://github.com/gmpsankalpa" target="_blank" rel="noopener noreferrer" className={styles.contributionBtn}>
							<i className="fab fa-github"></i>
							Visit GitHub Profile
						</a>
						<p className={styles.contributionNote}>
							<i className="fas fa-star"></i>
							Don't forget to star the repositories you find useful!
						</p>
					</div>
				</div>
			</section>
        </main>
	);
};

export default SourceCode;
