'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './nftPage.module.css';
import WalletLogo from '@/../public/images/pay.png';
import Loader from '../loader/Loader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NFTPage = ({ params }) => {
    const { id } = params;
    const [nft, setNft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isBidLoading, setIsBidLoading] = useState(false);
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
    const [popupActive, setPopupActive] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            const fetchProfile = async () => {
                try {
                    const res = await fetch('/api/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        const profileData = await res.json();
                        setBuyerEmail(profileData.email);
                    } else {
                        throw new Error('Failed to fetch user profile');
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };
            fetchProfile();
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchNFT = async () => {
            try {
                const res = await fetch(`/api/get-nft/${id}`);
                if (!res.ok) {
                    setError(`NFT with ID ${id} no longer exists.`);
                    return;
                }
                const data = await res.json();
                if (isMounted) setNft(data);
            } catch (error) {
                if (isMounted) setError(error.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchNFT();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (!isAuthenticated) {
        return (
            <div className={styles.authRequired}>
                <div>
                    <h2>You need to log in to list your NFTs</h2>
                    <button
                        className="blackBtn"
                        onClick={() => router.push('/account')}
                    >
                        Go to Login Page
                    </button>
                </div>
            </div>
        );
    }

    const handlePayment = async () => {
        setIsBidLoading(true);
        try {
            const response = await fetch('/api/mock-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyerEmail,
                    nftData: {
                        id: nft.id,
                        name: nft.name,
                        description: nft.description,
                        price: nft.price,
                        currency: nft.currency,
                        size: nft.size,
                        creator_username: nft.creator_username,
                        image_url: nft.image_url,
                    },
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setPopupMessage(data.message);
                setNft(null);


            } else {
                setPopupMessage(data.message);


            }
            setIsSuccessPopupVisible(true);
            setTimeout(() => {
                setPopupActive(true);
            }, 50);
        } catch (error) {
            setPopupMessage('Payment failed. Please try again.');
            setIsSuccessPopupVisible(true);
            setTimeout(() => {
                setPopupActive(true);
            }, 50);
        } finally {
            setIsBidLoading(false);
            console.log('Buyer Email:', buyerEmail);

        }
    };

    const handleClosePopup = () => {
        setPopupActive(false);
        setTimeout(() => {
            setIsSuccessPopupVisible(false);
        }, 100);
    };

    return (
        <div className={styles.nftWrapper}>
            {loading ? (
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>
            ) : error ? (
                <div className={styles.noItems}><p>{error}</p></div>
            ) : nft ? (
                <>
                    <Image className={styles.nftImage} src={nft.image_url} alt={nft.name} width={300} height={300} />
                    <div className={styles.infoWrapper}>
                        <div className={styles.titleAndDesc}>
                            <h1>{nft.name}</h1>
                            <p>{nft.description}</p>
                            <div className={styles.linkWrapper}>
                                <Link href={`/creator/${nft.userid}`}>
                                    <div className={styles.creatorImageAndName}>
                                        <Image
                                            src={nft.creator_profile_image_url}
                                            alt={nft.creator_username}
                                            width={400}
                                            height={400}
                                            className={styles.profileImage}
                                        />
                                        <p>{nft.creator_username}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.priceAndCurAndBtn}>
                            <div className={styles.priceAndCur}>
                                <div className={styles.priceAndCurWrapper}>
                                    <span>Current Bid</span>
                                    <h3>{nft.price}</h3>
                                </div>
                                <div className={styles.priceAndCurWrapper}>
                                    <span>Size</span>
                                    <h3>{nft.size} x {nft.size}</h3>
                                </div>
                                <div className={styles.priceAndCurWrapper}>
                                    <span>Currency</span>
                                    <h3>{nft.currency}</h3>
                                </div>
                            </div>
                            {isBidLoading ? (
                                <div className={styles.loaderBtn}><Loader /></div>
                            ) : (
                                <button className={`${styles.walletBtn} blackBtn`} onClick={handlePayment}>
                                    <Image src={WalletLogo} width={22} height={22} alt="Wallet" /> PLACE BID
                                </button>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.noItems}><p>NFT with ID {id} no longer exists.</p></div>
            )}

            {isSuccessPopupVisible && (
                <div className={styles.wrapperBlur}>
                    <div className={`${styles.overlay} ${popupActive ? styles.active : ''}`}></div>
                    <div className={styles.popupContent}>
                        <h2>{popupMessage}</h2>
                        <button onClick={handleClosePopup} className="blackBtn">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTPage;
