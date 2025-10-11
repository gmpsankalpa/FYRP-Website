import { Link } from 'react-router-dom';
import styles from './Error404.module.css';

const Error404 = () => (
<div className={styles.error404}>
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className={styles.homeLink}>Go to Home</Link>
</div>
);

export default Error404;