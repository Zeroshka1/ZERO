'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './creatorProfile.module.css';
import defAvatar from '@/../public/images/default-avatar.png';
import Loader from '@/app/components/loader/Loader.jsx';
import Link from 'next/link';

const CreatorProfile = ({ userId }) => {
    const [creatorData, setCreatorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCreatorData = async () => {
            try {
                const response = await fetch(`/api/creator?userId=${userId}`);
                if (!response.ok) {
                    throw new Error(`Error loading the creator's profile`);
                }
                const data = await response.json();
                setCreatorData(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchCreatorData();
        }
    }, [userId]);

    if (isLoading) {
        return <div className={styles.loaderWrapper}><Loader /></div>;
    }

    if (error) {
        return <div className={styles.loaderWrapper}>Error: {error}</div>;
    }

    if (!creatorData) {
        return <div className={styles.loaderWrapper}>The creator's profile was not found.</div>;
    }

    return (
        <div className={styles.accountProfileContainer}>
            <div className={styles.profileContainer}>
                <div className={styles.profileInfoAll}>
                    <div className={styles.profileInfoText}>
                        <Image
                            src={creatorData.profile_image_url || defAvatar}
                            alt={`${creatorData.username} profile image`}
                            width={250}
                            height={250}
                            className={styles.profileImage}
                        />
                        <p className={styles.name}>{creatorData.username}</p>
                    </div>
                </div>

                <div className={styles.yourWork}>
                    <h1>Creator NFTs</h1>
                    {creatorData.nfts && creatorData.nfts.length > 0 ? (
                        <div className={styles.nftGrid}>
                            {creatorData.nfts.map((nft) => (
                                <div key={nft.id} className={styles.nftCard}>
                                    <Image
                                        src={nft.image_url}
                                        alt={nft.name}
                                        width={150}
                                        height={150}
                                        className={styles.nftImage}
                                    />
                                    <h3>{nft.name}</h3>
                                    <p>{nft.price} {nft.currency}</p>

                                    <Link href={`/nft/${nft.id}`} passHref>
                                        <button className="blackBtn">GO</button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>The creator does not have any created NFTs yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatorProfile;
