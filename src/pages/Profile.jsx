import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, sendEmailVerification, sendPasswordResetEmail, updateEmail, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../config/firebase';
import styles from './Profile.module.css';
import usePageTitle from '../hooks/usePageTitle';
import { SkeletonProfile } from '../components/SkeletonLoader';

const Profile = () => {
    usePageTitle('Profile');

    const navigate = useNavigate();
    const auth = getAuth(app);
    const storage = getStorage(app);
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Edit Name State
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');

    // Change Email State
    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [emailData, setEmailData] = useState({
        newEmail: '',
        currentPassword: ''
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setNewName(currentUser.displayName || '');
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 6000);
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showMessage('Please select a valid image file', 'error');
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            showMessage('Image must be less than 2MB', 'error');
            return;
        }

        try {
            setIsLoading(true);
            showMessage('Uploading image...', 'info');

            const imageRef = storageRef(storage, `profile-images/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(imageRef, file);
            const photoURL = await getDownloadURL(imageRef);

            await updateProfile(user, { photoURL });
            setUser({ ...user, photoURL });
            showMessage('Profile picture updated!', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showMessage('Upload failed. Try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetName = async () => {
        if (!newName.trim() || !user) return;

        try {
            setIsLoading(true);
            await updateProfile(user, { displayName: newName.trim() });
            setUser({ ...user, displayName: newName.trim() });
            setIsEditingName(false);
            showMessage('Name updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating name:', error);
            showMessage('Failed to update name. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            await sendEmailVerification(user);
            showMessage('Verification email sent! Please check your inbox.', 'success');
        } catch (error) {
            console.error('Error sending verification:', error);
            showMessage('Failed to send verification email. Please try again later.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);
            await sendPasswordResetEmail(auth, user.email);
            showMessage('Password reset email sent! Check your inbox.', 'success');
        } catch (error) {
            console.error('Error sending reset email:', error);
            showMessage('Failed to send password reset email.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeEmail = async () => {
        if (!emailData.newEmail || !emailData.currentPassword || !user) return;

        try {
            setIsLoading(true);
            const credential = EmailAuthProvider.credential(user.email, emailData.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updateEmail(user, emailData.newEmail);

            setIsChangingEmail(false);
            setEmailData({ newEmail: '', currentPassword: '' });
            showMessage('Email updated successfully! Please verify your new email.', 'success');

            await sendEmailVerification(user);
        } catch (error) {
            console.error('Error changing email:', error);
            if (error.code === 'auth/wrong-password') {
                showMessage('Incorrect password. Please try again.', 'error');
            } else if (error.code === 'auth/email-already-in-use') {
                showMessage('This email is already in use.', 'error');
            } else {
                showMessage('Failed to change email. Please try again.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(true);
        setDeleteConfirmText('');
    };

    const confirmDeleteAccount = async () => {
        if (!user) return;

        if (deleteConfirmText !== 'DELETE') {
            showMessage('Please type DELETE to confirm', 'error');
            return;
        }

        try {
            setIsLoading(true);
            setShowDeleteConfirm(false);
            await deleteUser(user);
            showMessage('Account deleted.', 'success');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            if (error.code === 'auth/requires-recent-login') {
                showMessage('Please re-login to delete account.', 'error');
            } else {
                showMessage('Deletion failed. Try again.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            showMessage('Signed out successfully!', 'success');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
            showMessage('Failed to sign out.', 'error');
        }
    };

    if (!user) {
        return (
            <div className={styles.profilePage}>
                <div className={styles.loading}>
                    <i className="fas fa-spinner fa-spin"></i> Loading...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1><span className={styles.highlight}>Manage</span> Your Account, <span className={styles.highlight}>Empower</span> Your Security</h1>
                    <p className={styles.heroDesc}>View and update your personal details, change your password, and control your privacy settings.</p>
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

            {/* Message Container */}
            {message.text && (
                <div className={`${styles.messageContainer} ${styles[message.type]}`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} aria-label="Close">
                        &times;
                    </button>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className={`${styles.modal} ${styles.show}`}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeBtn} onClick={() => setShowDeleteConfirm(false)}>&times;</span>
                        <h2><i className="fas fa-exclamation-triangle"></i> Delete Account</h2>
                        <div className={styles.confirmMessage}>
                            <p className={styles.dangerText}>⚠️ This action cannot be undone!</p>
                            <div className={styles.deleteDetails}>
                                <h4>You are about to permanently delete:</h4>
                                <ul>
                                    <li><i className="fas fa-user"></i> Your profile and personal data</li>
                                    <li><i className="fas fa-database"></i> All your energy monitoring data</li>
                                    <li><i className="fas fa-cog"></i> System configurations and settings</li>
                                    <li><i className="fas fa-chart-line"></i> Historical analytics and reports</li>
                                </ul>
                            </div>
                            <div className={styles.confirmInput}>
                                <label htmlFor="deleteConfirm">Type <strong>DELETE</strong> to confirm:</label>
                                <input
                                    type="text"
                                    id="deleteConfirm"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type DELETE here"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowDeleteConfirm(false)}>
                                <i className="fas fa-times"></i> Cancel
                            </button>
                            <button 
                                className={styles.confirmBtn} 
                                onClick={confirmDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                            >
                                <i className="fas fa-trash-alt"></i> Delete Account Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!user ? (
                <SkeletonProfile />
            ) : (
            <div className={styles.profileContainer}>
                {/* Profile Card */}
                <div className={styles.profileCard}>
                    <h2>
                        <i className="fas fa-user"></i> Profile Information
                    </h2>

                    <div className={styles.userAvatar}>
                        <div className={styles.avatarContainer}>
                            <img
                                src={user.photoURL || require('../assets/default-avatar.png')}
                                alt="Profile"
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <div
                                className={styles.avatarOverlay}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <i className="fas fa-camera"></i>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleProfileImageUpload}
                            />
                        </div>

                        <h3>{user.displayName || 'No Name'}</h3>
                        <p className={styles.userEmail}>{user.email}</p>

                        {/* Name Edit Section */}
                        {!user.displayName && !isEditingName && (
                            <button
                                className={styles.editNameBtn}
                                onClick={() => setIsEditingName(true)}
                            >
                                Set Name
                            </button>
                        )}

                        {user.displayName && !isEditingName && (
                            <button
                                className={styles.editNameBtn}
                                onClick={() => setIsEditingName(true)}
                            >
                                Edit Name
                            </button>
                        )}

                        {isEditingName && (
                            <div className={styles.editNameForm}>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                                <div className={styles.editNameButtons}>
                                    <button onClick={handleSetName} disabled={isLoading}>
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button onClick={() => setIsEditingName(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <label>Email</label>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.infoIcon}>
                                <i className={`fas ${user.emailVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                            </div>
                            <div className={styles.infoContent}>
                                <label>Account Status</label>
                                <p>{user.emailVerified ? 'Verified' : 'Unverified'}</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-calendar-plus"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <label>Member Since</label>
                                <p>{formatDate(user.metadata.creationTime)}</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <label>Last Login</label>
                                <p>{formatDate(user.metadata.lastSignInTime)}</p>
                            </div>
                        </div>
                    </div>

                    {!user.emailVerified && (
                        <div className={styles.verifySection}>
                            <button
                                className={styles.verifyBtn}
                                onClick={handleVerifyEmail}
                                disabled={isLoading}
                            >
                                <i className="fas fa-envelope-open-text"></i>
                                {isLoading ? 'Sending...' : 'Verify Email'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions Card */}
                <div className={styles.actionsCard}>
                    <h2>
                        <i className="fas fa-cog"></i> Account Actions
                    </h2>

                    <div className={styles.actionsGrid}>
                        {/* Reset Password */}
                        <div className={styles.actionItem}>
                            <div className={styles.actionContentRow}>
                                <div className={styles.actionIcon}>
                                    <i className="fas fa-key"></i>
                                </div>
                                <div className={styles.actionLabels}>
                                    <h3>Reset Password</h3>
                                    <p>Send a password reset link to your email</p>
                                </div>
                            </div>
                            <button
                                className={styles.actionBtn}
                                onClick={handleResetPassword}
                                disabled={isLoading}
                            >
                                <i className="fas fa-paper-plane"></i>
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>

                        {/* Change Email */}
                        <div className={styles.actionItem}>
                            <div className={styles.actionContentRow}>
                                <div className={styles.actionIcon}>
                                    <i className="fas fa-at"></i>
                                </div>
                                <div className={styles.actionLabels}>
                                    <h3>Change Email</h3>
                                    <p>Update your account email address</p>
                                </div>
                            </div>
                            {!isChangingEmail ? (
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => setIsChangingEmail(true)}
                                >
                                    <i className="fas fa-edit"></i>
                                    Change Email
                                </button>
                            ) : (
                                <div className={styles.changeEmailForm}>
                                    <input
                                        type="email"
                                        placeholder="New email address"
                                        value={emailData.newEmail}
                                        onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        value={emailData.currentPassword}
                                        onChange={(e) => setEmailData({ ...emailData, currentPassword: e.target.value })}
                                    />
                                    <div className={styles.emailFormButtons}>
                                        <button onClick={handleChangeEmail} disabled={isLoading}>
                                            {isLoading ? 'Updating...' : 'Update Email'}
                                        </button>
                                        <button onClick={() => setIsChangingEmail(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Privacy Settings */}
                        <div className={styles.actionItem}>
                            <div className={styles.actionContentRow}>
                                <div className={styles.actionIcon}>
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className={styles.actionLabels}>
                                    <h3>Privacy Settings</h3>
                                    <p>Manage your privacy preferences</p>
                                </div>
                            </div>
                            <button
                                className={styles.actionBtn}
                                onClick={() => navigate('/privacy')}
                            >
                                <i className="fas fa-arrow-right"></i>
                                View Privacy Policy
                            </button>
                        </div>

                        {/* Sign Out */}
                        <div className={styles.actionItem}>
                            <div className={styles.actionContentRow}>
                                <div className={styles.actionIcon}>
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                                <div className={styles.actionLabels}>
                                    <h3>Sign Out</h3>
                                    <p>Log out of your account</p>
                                </div>
                            </div>
                            <button
                                className={styles.actionBtn}
                                onClick={handleSignOut}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className={styles.dangerZone}>
                    <h3>
                        <i className="fas fa-exclamation-triangle"></i> Danger Zone
                    </h3>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button
                        className={styles.btnDanger}
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                    >
                        <i className="fas fa-trash-alt"></i>
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
            )}
        </div>
    );
};

export default Profile;
