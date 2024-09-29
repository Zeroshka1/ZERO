'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from '../discoverPage.module.css';
import Link from 'next/link';
import Loader from '../../loader/Loader';

const ITEMS_PER_PAGE = 6; 

const DiscoverItems = () => {
    const [nfts, setNfts] = useState([]); 
    const [visibleNFTs, setVisibleNFTs] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false); 


    useEffect(() => {
        async function fetchNFTs() {
            try {
                const res = await fetch('/api/get-nfts');
                const data = await res.json();
                setNfts(data);
                setVisibleNFTs(data.slice(0, ITEMS_PER_PAGE)); 
                setIsLoading(false); 
            } catch (error) {
                console.error('Ошибка при получении данных NFT:', error);
                setIsLoading(false); 
            }
        }
        fetchNFTs();
    }, []);


    const loadMoreNFTs = useCallback(() => {
        if (isLoadingMore || isLoading) return;

        setIsLoadingMore(true); 
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        setTimeout(() => {
            setVisibleNFTs((prevNFTs) => [
                ...prevNFTs,
                ...nfts.slice(startIndex, endIndex)
            ]);
            setCurrentPage(nextPage);
            setIsLoadingMore(false);
        }, 500); 
    }, [nfts, currentPage, isLoadingMore, isLoading]);


    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !isLoadingMore &&
                !isLoading &&
                visibleNFTs.length < nfts.length
            ) {
                loadMoreNFTs(); 
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreNFTs, visibleNFTs, nfts, isLoadingMore, isLoading]);

    return (
        <div className={styles.discoverItemsContainer}>
            <h1>Discover NFTs</h1>
            {nfts.length != 0 ? (<div className={styles.discoverItemsWrapper}>
                {isLoading ? (
                    <div className={styles.loaderWrapper}>
                        <Loader />
                    </div>
                ) : (
                    visibleNFTs.map((nft, index) => (
                        <div key={index} className={styles.nft_item}>
                            <Image src={nft.image_url} alt={nft.name} width={250} height={250} />
                            <div className={styles.nft_details}>
                                <h3>{nft.name}</h3>
                                <div className={styles.priceCurcBtnWrapper}>
                                    <div className={styles.priceCurc}>
                                        <span>{nft.price}</span>
                                        <span>{nft.currency}</span>
                                    </div>
                                    <Link href={`/nft/${nft.id}`} passHref>
                                        <button className='blackBtn'>PLACE BID</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>) : (<div className={styles.noNFTs}><p>There are no NFTs available.</p></div>)}


 
            {isLoadingMore && (
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default DiscoverItems;
