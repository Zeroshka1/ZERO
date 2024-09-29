'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import FormSell from './formSell/FormSell';
import styles from './sellPage.module.css';
import Loader from '../loader/Loader.jsx';

const SellPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); 
        setLoading(false);
    }, [router]);
    

    if (loading) {
        return <div className={styles.authRequired}><Loader/></div>;
    }

    if (!isAuthenticated) {
        
        return (
            <div className={styles.authRequired}>
                <div>
                    <h2>You need to log in to list your NFTs</h2>
                    <button className="blackBtn" onClick={() => router.push('/account')}>Go to Login Page</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sellPageWrapper}>
            <h1>Create Your NFT</h1>
            <FormSell />
        </div>
    );
};

export default SellPage;
