import styles from "./SocialMedia.module.css";

const SocialMedia = () => (
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
);

export default SocialMedia;