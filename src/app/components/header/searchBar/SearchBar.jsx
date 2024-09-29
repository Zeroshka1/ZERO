'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../search.module.css';
import Link from 'next/link';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);


    const fetchSearchResults = async (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            setIsDropdownVisible(false);
            return;
        }

        try {
            const response = await fetch(`/api/get-nfts?query=${term}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
                setIsDropdownVisible(data.length > 0);
            } else {
                console.error('Search request failed.');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };


    const handleSearch = (term) => {
        setSearchTerm(term);
        fetchSearchResults(term); 
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.searchContainer}`)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search Art Work / Creator"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsDropdownVisible(searchResults.length > 0)}
            />


            {isDropdownVisible && (
                <ul className={styles.dropdown}>
                    {searchResults.map((result) => (
                        <Link href={`/nft/${result.id}`}>
                            <li key={result.id} className={styles.dropdownItem}>

                                <Image
                                    src={result.image_url}
                                    alt={result.name}
                                    width={50}
                                    height={50}
                                    className={styles.nftImage}
                                />

                                <div className={styles.nftInfo}>
                                    <span className={styles.nftName}>{result.name}</span>
                                    <span className={styles.nftPrice}>{result.price} {result.currency}</span>
                                </div>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
