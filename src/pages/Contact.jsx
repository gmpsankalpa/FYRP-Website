import { useEffect, useState } from 'react';
import styles from './Contact.module.css';
import usePageTitle from '../hooks/usePageTitle';
import { SkeletonForm, SkeletonCard } from '../components/SkeletonLoader';

const Contact = () => {
  // Set page title
  usePageTitle('Contact Us');

  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus('');

    const formData = new FormData(e.target);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setFormStatus('success');
        e.target.reset();
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            <span className={styles.highlight}>
              <i className="fas fa-envelope"></i>
              {' '}
              Get</span> In Touch
          </h1>
          <p className={styles.heroDesc}>
            Have questions about Smart Energy Meter? We're here to help. Reach out to us for
            technical support, project inquiries, or partnership opportunities.
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

      {/* Contact Content */}
      <section className={styles.contactContent}>
        <div className={styles.contactGrid}>
          {/* Contact Form */}
          <div className={styles.contactFormSection}>
            {isInitialLoad ? (
              <div className={styles.contactCard}>
                <SkeletonForm fields={5} />
              </div>
            ) : (
            <div className={styles.contactCard}>
              <h2>
                <i className="fas fa-paper-plane"></i> Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <input type="hidden" name="access_key" value="b0bbe751-66e2-401d-8930-6059188cda19" />
                <input type="hidden" name="subject" value="New Contact Form Submission from Smart Energy Meter" />
                <input type="hidden" name="from_name" value="Smart Energy Meter Contact Form" />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                <div className={styles.formGroup}>
                  <label htmlFor="name">
                    <i className="fas fa-user"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="inquiry_type">
                    <i className="fas fa-tag"></i>
                    Subject
                  </label>
                  <select id="inquiry_type" name="inquiry_type" required>
                    <option value="">Select a subject</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="project-inquiry">Project Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">
                    <i className="fas fa-comment"></i>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    required
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>

                <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                  <input type="checkbox" id="newsletter" name="newsletter" />
                  <label htmlFor="newsletter">
                    Subscribe to our newsletter for updates and energy-saving tips
                  </label>
                </div>

                <button type="submit" className={`${styles.submitBtn} ${isLoading ? styles.loading : ''}`} disabled={isLoading}>
                  <i className="fas fa-paper-plane"></i>
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>

                {formStatus === 'success' && (
                  <div className={styles.successMessage}>
                    <i className="fas fa-check-circle"></i>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    <i className="fas fa-exclamation-circle"></i>
                    Failed to send message. Please try again.
                  </div>
                )}
              </form>
            </div>
            )}
          </div>

          {/* Contact Information */}
          <div className={styles.contactInfoSection}>
            {isInitialLoad ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
            <div className={styles.infoCard}>
              <h2>
                <i className="fas fa-info-circle"></i> Contact Information
              </h2>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Email Us</h3>
                  <p>19ict036@seu.ac.lk</p>
                  <span>We'll respond within 24 hours</span>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-phone"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Call Us</h3>
                  <p>+94 71 188 7202</p>
                  <span>Mon-Fri, 9:00 AM - 5:00 PM</span>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Visit Us</h3>
                  <p>South Eastern University of Sri Lanka,</p>
                  <span>University Park, Oluvil #32360,</span><br />
                  <span>Sri Lanka.</span>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <i className="fas fa-clock"></i>
                </div>
                <div className={styles.contactDetails}>
                  <h3>Response Time</h3>
                  <p>24-48 Hours</p>
                  <span>For all technical inquiries</span>
                </div>
              </div>
            </div>

            {/* Quick Support */}
            <div className={styles.supportCard}>
              <h3>
                <i className="fas fa-life-ring"></i> Quick Support
              </h3>
              <div className={styles.supportLinks}>
                <a href="/download" className={styles.supportLink}>
                  <i className="fas fa-download"></i>
                  <span>Download App</span>
                </a>
                <a href="/about" className={styles.supportLink}>
                  <i className="fas fa-book"></i>
                  <span>Documentation</span>
                </a>
                <a href="/" className={styles.supportLink}>
                  <i className="fas fa-cogs"></i>
                  <span>Configuration Guide</span>
                </a>
                <a href="https://github.com/gmpsankalpa/" target="_blank" rel="noopener noreferrer" className={styles.supportLink}>
                  <i className="fab fa-github"></i>
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
