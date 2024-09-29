import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../accountPage.module.css';

const AuthForm = ({ onAuthSuccess, onClose }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    setOpen(true);
  }, []);
 
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/account');
    }
  }, [router]);

  const triggerFileUpload = () => {
    document.getElementById('imageUploadInput').click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/login' : '/api/register';

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    if (!isLogin) {
      formData.append('email', email);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
    }

    await sendRequest(formData, url);
  };

  const sendRequest = async (formData, url) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user_id', result.user_id);

            if (!isLogin) {
                setMessage('Registration was successful!.');
                setUsername(username);
                setPassword(password);
                setIsLogin(true);
                onAuthSuccess(); 
            } else {
                setMessage('The login was completed successfully!');
                setMessageType('success');
                onAuthSuccess();
                router.push('/account');
            }

            onClose();
        } else {
            setMessage(result.error || 'Error.');
            setMessageType('error');
        }
    } catch (error) {
        console.error('Error sending the request:', error);
        setMessage('Request error. Try again.');
        setMessageType('error');
    }
};



  return (
    <div className={`${styles.wrapperBlur}`}>
      <div className={`${styles.overlay} ${open ? styles.active : ''}`}></div>
      <div className={styles.formAuth}>
        <div className={styles.titleAndClose}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          <h2 className={styles.titleForm}>{isLogin ? 'Login' : 'Register'}</h2>
        </div>

        {message && <div className={`${styles.message} ${styles[messageType]}`}>{message}</div>}

        <form onSubmit={handleAuth} className={styles.formInput}>
          {!isLogin && (
            <div className={styles.loadImageProfile}>
              <button type="button" onClick={triggerFileUpload} className={styles.profileImageButton}>
                {previewImage ? (
                  <img src={previewImage} alt="Profile Preview" className={styles.profilePreview} />
                ) : (
                  'A'
                )}
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="imageUploadInput"
                style={{ display: 'none' }}
              />
            </div>
          )}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
          )}

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className={styles.btnsAuth}>
            <button type="submit" className={`blackBtn`}>
              {isLogin ? 'Login' : 'Register'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
                setMessageType('');
              }}
              className={'blackBtn'}
            >
              {isLogin ? 'Or Register?' : 'Or Login?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
