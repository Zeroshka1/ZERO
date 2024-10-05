'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '../creatorsPage.module.css';
import defAvatar from '@/../public/images/default-avatar.png';
import Loader from '../../loader/Loader.jsx';

const ITEMS_PER_PAGE = 4;

const CreatorCollections = () => {
    const [collections, setCollections] = useState([]);
    const [visibleCollections, setVisibleCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCollections = async () => {
            console.log('Fetching collections...');
            try {
                const response = await fetch('/api/collections');
                if (!response.ok) {
                    throw new Error('Error loading collections');
                }
                const data = await response.json();
                console.log('Fetched collections:', data);
                setCollections(data);
                setVisibleCollections(data.slice(0, ITEMS_PER_PAGE));
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching collections:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const loadMoreCollections = useCallback(() => {
        if (isLoadingMore || isLoading) return;

        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        setTimeout(() => {
            setVisibleCollections((prevCollections) => [
                ...prevCollections,
                ...collections.slice(startIndex, endIndex),
            ]);
            setCurrentPage(nextPage);
            setIsLoadingMore(false);
        }, 500);
    }, [collections, currentPage, isLoadingMore, isLoading]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !isLoadingMore &&
                !isLoading &&
                visibleCollections.length < collections.length
            ) {
                loadMoreCollections();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreCollections, visibleCollections, collections, isLoadingMore, isLoading]);

    if (error) {
        console.error('Error:', error);
        return <div>Error: {error}</div>;
    }

    const handleProfileClick = (userId) => {
        console.log(`Navigating to profile of user ID: ${userId}`);
        router.push(`/creator/${userId}`);
    };

    return (
        <div className={styles.collectionsContainer}>
            <h1>Creator Collections</h1>
            <div className={styles.collectionWrapper}>
                {visibleCollections.length === 0 ? (
                    <div className={styles.loaderWrapper}><Loader /></div>
                ) : (
                    visibleCollections.map((user) => {
                        const nftCount = user.collections.length;
                        const displayedNfts = user.collections.slice(0, 3);
                        const remainingNftCount = nftCount - 3;

                        return (
                            <div key={user.id} className={styles.collectionCard} onClick={() => handleProfileClick(user.id)}>
                                <div className={styles.bgProfile}>
                                    <Image
                                        src={user.profile_image_url || defAvatar}
                                        alt={`${user.username} profile image`}
                                        width={800}
                                        height={800}
                                        className={styles.profileImage}
                                    />
                                </div>
                                <Image
                                    src={user.profile_image_url || defAvatar}
                                    alt={`${user.username} profile image`}
                                    width={400}
                                    height={400}
                                    className={styles.profileImage}
                                />
                                <h2>{user.username}</h2>

                                <div className={styles.itemsCount}>
                                    <h2>{nftCount}</h2>
                                    <span>items</span>
                                </div>

                                <div className={styles.nftGrid}>
                                    {displayedNfts.map((nft, index) => {
                                        console.log('Rendering NFT:', nft);

                                        if (index === 2 && remainingNftCount > 0) {
                                            return (
                                                <div key={nft.id} className={`${styles.nftItem} ${styles.overlayContainer}`}>
                                                    <Image
                                                        src={nft.image_url}
                                                        alt={nft.name}
                                                        width={800}
                                                        height={800}
                                                        className={styles.nftImage}
                                                    />
                                                    <div className={styles.overlay}>
                                                        <span>+{remainingNftCount}</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={nft.id} className={styles.nftItem}>
                                                <Image
                                                    src={nft.image_url}
                                                    alt={nft.name}
                                                    width={800}
                                                    height={800}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {isLoadingMore && (
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CreatorCollections;
