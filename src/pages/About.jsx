import { useEffect } from 'react';
import styles from './About.module.css';

const About = () => {
  useEffect(() => {
    // Load Font Awesome
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
          <h1><span className={styles.highlight}>About</span> Us</h1>
          <p className={styles.heroDesc}>
            Arduino-Based Smart Home Energy Management with Energy Theft Detection and IoT: 
            A Real-Time Monitoring and Control System
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>2019-2020</span>
              <span className={styles.statLabel}>Academic Year</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>GMP Sankalpa</span>
              <span className={styles.statLabel}>Developer</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>ICT318</span>
              <span className={styles.statLabel}>Index Number</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img 
            src={require('../assets/logo.png')} 
            alt="Smart Meter Logo" 
            style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }}
            onError={e => e.target.style.display = 'none'} 
          />
        </div>
      </section>

      {/* Student Information Section */}
      <section className={styles.technicalOverview}>
        <div className={styles.technicalContent}>
          <h2>Student Information</h2>
          <div className={styles.technicalGrid}>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className={styles.techInfo}>
                <h3>Student Name</h3>
                <p><strong>GMP Sankalpa</strong></p>
                <p>Final Year Research Student</p>
                <p>Department of Information and Communication Technology</p>
              </div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <i className="fas fa-id-card"></i>
              </div>
              <div className={styles.techInfo}>
                <h3>Index Number</h3>
                <p><strong>ICT318</strong></p>
                <p>Academic Year: 2019-2020</p>
                <p>Final Year Research Project</p>
              </div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className={styles.techInfo}>
                <h3>Degree Program</h3>
                <p>Bachelor of Information and Communication Technology (Honours)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className={styles.featuresModern}>
        <h2>Project Overview</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎯</span>
            <h3>Problem Statement</h3>
            <p>
              Conventional energy monitoring lacks real-time data, theft detection, and remote control 
              capabilities, leading to inefficiency and financial losses.
            </p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🚀</span>
            <h3>Solution</h3>
            <p>
              IoT-based smart energy management system with real-time monitoring, theft detection, 
              and remote control capabilities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>💡</span>
            <h3>Innovation</h3>
            <p>
              Cost-effective Arduino-based system with commercial-grade features accessible to 
              typical households.
            </p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🌍</span>
            <h3>Impact</h3>
            <p>
              Addresses global energy theft ($96B annual loss) while promoting sustainable energy 
              consumption.
            </p>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className={styles.architectureSection}>
        <div className={styles.architectureContent}>
          <h2>Project Specifications</h2>
          <div className={styles.architectureInfo}>
            <div className={styles.architectureText}>
              <h3>Core Objectives</h3>
              <p>
                Design and implement a cost-effective Arduino-based smart home energy management 
                system with IoT integration for real-time monitoring, theft detection, and remote 
                appliance control.
              </p>
              
              <h3>Technical Goals</h3>
              <ul>
                <li>Develop real-time energy monitoring system</li>
                <li>Implement theft detection algorithms</li>
                <li>Create IoT-enabled remote control interface</li>
                <li>Build cloud-based data logging system</li>
                <li>Design user-friendly mobile application</li>
                <li>Ensure system reliability and accuracy</li>
              </ul>
            </div>
            <div className={styles.architectureVisual}>
              <div className={styles.architectureDiagram}>
                <div className={`${styles.diagramItem} ${styles.sensor}`}>Sensors (ACS712, ZMPT101B)</div>
                <div className={styles.diagramArrow}>↓</div>
                <div className={`${styles.diagramItem} ${styles.arduino}`}>Arduino Uno</div>
                <div className={styles.diagramArrow}>↓</div>
                <div className={`${styles.diagramItem} ${styles.esp32}`}>ESP32 (WiFi Module)</div>
                <div className={styles.diagramArrow}>↓</div>
                <div className={`${styles.diagramItem} ${styles.cloud}`}>Cloud Database</div>
                <div className={styles.diagramArrow}>↓</div>
                <div className={`${styles.diagramItem} ${styles.dashboard}`}>Web/Mobile Dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className={styles.technicalOverview}>
        <div className={styles.technicalContent}>
          <h2>Technology Stack</h2>
          <div className={styles.technicalGrid}>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <i className="fas fa-microchip"></i>
              </div>
              <div className={styles.techInfo}>
                <h3>Hardware Components</h3>
                <ul>
                  <li>Arduino Uno R3</li>
                  <li>ESP32 WiFi Module</li>
                  <li>ACS712 Current Sensor</li>
                  <li>ZMPT101B Voltage Sensor</li>
                  <li>Relay Modules (4-Channel)</li>
                  <li>LCD Display (16x2)</li>
                  <li>Power Supply Unit</li>
                </ul>
              </div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <i className="fas fa-code"></i>
              </div>
              <div className={styles.techInfo}>
                <h3>Software & Programming</h3>
                <ul>
                  <li>Arduino IDE (C/C++)</li>
                  <li>Firebase Realtime Database</li>
                  <li>React.js (Web Dashboard)</li>
                  <li>Android Studio (Mobile App)</li>
                  <li>MQTT Protocol</li>
                  <li>REST API</li>
                  <li>Cloud Functions</li>
                </ul>
              </div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <i className="fas fa-chart-line"></i>
              </div>
              <div className={styles.techInfo}>
                <h3>Features & Capabilities</h3>
                <ul>
                  <li>Real-time Monitoring</li>
                  <li>Energy Theft Detection</li>
                  <li>Remote Appliance Control</li>
                  <li>Data Analytics & Reports</li>
                  <li>Push Notifications</li>
                  <li>Historical Data Storage</li>
                  <li>User Authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Deliverables Section */}
      <section className={styles.benefitsSection}>
        <h2>Project Deliverables</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <i className="fas fa-cogs"></i>
            </div>
            <h3>Hardware Prototype</h3>
            <p>
              Working Arduino & ESP32-based energy monitoring and control unit with sensor integration
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <h3>Real-time Monitoring</h3>
            <p>
              Continuous tracking of voltage, current, power, and energy consumption with cloud data logging
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Theft Detection System</h3>
            <p>
              Threshold-based energy theft detection with &gt;95% accuracy and instant alert system
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>User Applications</h3>
            <p>
              Web-based IoT dashboard and Android mobile app for monitoring, control, and notifications
            </p>
          </div>
        </div>
      </section>

      {/* Project Timeline Section */}
      <section className={styles.aboutModern}>
        <h2>Project Timeline</h2>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>Aug-Sep 2025</div>
            <div className={styles.timelineContent}>
              <h3>Phase 1: Research & Design</h3>
              <p>Literature review, requirement analysis, system design, and component selection</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>Oct-Dec 2025</div>
            <div className={styles.timelineContent}>
              <h3>Phase 2: Hardware Development</h3>
              <p>Circuit design, sensor calibration, Arduino programming, and prototype assembly</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>Jan-Mar 2026</div>
            <div className={styles.timelineContent}>
              <h3>Phase 3: Software Development</h3>
              <p>IoT integration, cloud setup, web dashboard, and mobile app development</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>Apr-Jul 2026</div>
            <div className={styles.timelineContent}>
              <h3>Phase 4: Testing & Documentation</h3>
              <p>System testing, performance evaluation, bug fixes, and final documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites Section */}
      <section className={styles.featuresModern}>
        <h2>Required Prerequisites</h2>
        <div className={styles.prerequisitesGrid}>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-network-wired"></i>
            <span>IoT Concepts</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-code"></i>
            <span>Programming Skills</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-chart-bar"></i>
            <span>Data Analysis</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-mobile"></i>
            <span>App Development</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-globe"></i>
            <span>Web Development</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-microchip"></i>
            <span>Sensor Technology</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-satellite-dish"></i>
            <span>Communication Protocols</span>
          </div>
          <div className={styles.prerequisiteItem}>
            <i className="fas fa-tasks"></i>
            <span>Project Management</span>
          </div>
        </div>
      </section>

      {/* Developer Information */}
      <section className={styles.aboutModern}>
        <h2>About the Developer</h2>
        <div className={styles.developerProfile}>
          <div className={styles.developerAvatar}>
            <img 
              src={require('../assets/img/Myphoto.png')} 
              alt="GMP Sankalpa" 
              onError={(e) => {
                e.target.src = require('../assets/default-avatar.png');
              }}
            />
          </div>
          <div className={styles.developerInfo}>
            <h3>GMP Sankalpa</h3>
            <p className={styles.developerTitle}>Final Year Research Project Developer</p>
            <p className={styles.developerBio}>
              Passionate about IoT, embedded systems, and sustainable technology solutions. 
              This project represents the culmination of academic learning and practical innovation 
              in smart energy management, combining hardware design, software development, and cloud 
              integration to create a comprehensive energy monitoring solution.
            </p>
            <div className={styles.developerContact}>
              <p><strong>Email:</strong> gmpsankalpa@gmail.com</p>
              <p><strong>GitHub:</strong> github.com/gmpsankalpa</p>
              <p><strong>LinkedIn:</strong> linkedin.com/in/gmpsankalpa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.downloadModern}>
        <div className={styles.downloadContent}>
          <h2>Ready to Learn More?</h2>
          <p>Explore the Smart Energy Meter project documentation and implementation details.</p>
          <a href="/" className={styles.downloadBtnModern}>Back to Home</a>
        </div>
        <div className={styles.downloadImage}>
          <img 
            src={require('../assets/logo.png')} 
            alt="Smart Energy Meter" 
            onError={e => e.target.style.display = 'none'} 
            style={{ width: 100, height: 'auto', background: 'none', boxShadow: 'none', borderRadius: 0 }}
          />
        </div>
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

export default About;
