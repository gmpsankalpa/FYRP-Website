import styles from './Hero.module.css';

const Hero = () => (
    < section className={styles.hero} >
        <div className={styles.heroContent}>
            <h1><span className={styles.highlight}>Privacy</span> Policy</h1>
            <p className={styles.heroDesc}>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.</p>
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
);

export default Hero;
