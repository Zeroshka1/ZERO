import React, { useEffect, useState } from 'react';
import AuthForm from '../accountForm/AuthForm.jsx';
import styles from '../accountPage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../loader/Loader.jsx'; 

const AccountProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [loading, setLoading] = useState(true); 

  const toggleAuthForm = () => {
    setShowAuthForm((prev) => !prev);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found. Please log in again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setIsAuthenticated(true);
      } else {
        setError('Failed to fetch profile data.');
        setIsAuthenticated(false); 
        console.error('Response error:', response);
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('An error occurred while fetching profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setError('You are not authenticated. Please log in.');
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfileData(null);
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.accountProfileContainer}>
      {!isAuthenticated && showAuthForm && (
        <AuthForm onAuthSuccess={handleAuthSuccess} onClose={toggleAuthForm} />
      )}

      <div className={styles.profileContainer}>
        {profileData ? (
          <div className={styles.profileInfoAll}>
            <div className={styles.profileInfoText}>
              {profileData.profile_image_url ? (
                <Image
                  src={profileData.profile_image_url}
                  width={250}
                  height={250}
                  alt="Profile"
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.noAvatar}>A</div>
              )}
              <p className={styles.name}>{profileData.username}</p>
              <button className={'blackBtn'} onClick={handleLogout}>
                EXIT
              </button>
            </div>

            <div className={styles.yourWork}>
              <h1>Your NFTs</h1>
              {profileData.nfts && profileData.nfts.length > 0 ? (
                <div className={styles.nftGrid}>
                  {profileData.nfts.map((nft) => (
                    <div key={nft.id} className={styles.nftCard}>
                      <Image
                        src={nft.image_url}
                        width={150}
                        height={150}
                        alt={nft.name}
                        className={styles.nftImage}
                      />
                      <h3>{nft.name}</h3>
                      <p>{nft.price} {nft.currency}</p>

                      <Link href={`/nft/${nft.id}`} passHref>
                        <button className='blackBtn'>GO</button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You don't have any NFTs yet</p>
              )}
            </div>
          </div>
        ) : (
          !showAuthForm && (
            <div className={`${styles.enterBtn}`}>
              <div>
                <h2>Please log in to your profile</h2>
                <button onClick={toggleAuthForm} className="blackBtn">ENTER</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AccountProfile;
