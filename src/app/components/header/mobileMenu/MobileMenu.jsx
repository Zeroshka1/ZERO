import React, { useEffect } from 'react'
import Image from "next/image";
import Link from 'next/link';
import styles from '../header.module.css'
import Logo from '../../../../../public/images/Logo.png'
import { useState } from "react";
import SearchBar from '../searchBar/SearchBar';

function MobileMenu() {
    const [open, setOpen] = useState(false)


    useEffect(() => {
        if (open) {
            document.body.classList.add('hiddenScroll');
            document.documentElement.classList.add('hiddenScroll');
            console.log('работает')
        } else {
            document.body.classList.remove('hiddenScroll');
            document.documentElement.classList.remove('hiddenScroll');
            console.log('не работает')
        }
        return () => {
            document.body.classList.remove('hiddenScroll');
            document.documentElement.classList.remove('hiddenScroll');
        };
    }, [open]);

    const toggleMenu = () => {
        setOpen(!open);
    };

    const menuItemsData = [
        { title: 'Discover', url: '/discover' },
        { title: 'Creators', url: '/creators' },
        { title: 'Sell', url: '/sell' },
        { title: 'Account', url: '/account' },
    ];
    return (
        <>
            <div className={`${styles.blurBackground} ${open ? styles.active : ''}`} onClick={toggleMenu}></div>

            <header className={`${styles.headerWrapperMobile}`}>

                <div className={`${styles.logoNav}`}>
                    <div className={`${styles.logoNavWrapper} container`}>

                        <Link href='/'>
                            <Image
                                width={33}
                                height={53}
                                src={Logo}
                                alt="pep"
                            />
                        </Link>


                        <div className={`${styles.burgerBtn} ${open ? styles.open : ''}`} onClick={toggleMenu}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div></div>
                </div>



                <div className={`${styles.searchNavConnectBtn} ${open ? styles.show : ''}`}>

                    <SearchBar />

                    <nav>
                        <ul className={styles.navList}>
                            {menuItemsData.map((menu, index) => (
                                <li key={index}>
                                    <a href={menu.url}>{menu.title}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <button className={`${styles.connetWalletBtn} blackBtn disabled`}>Connect Wallet</button>
                </div>
            </header>
        </>

    )
}

export default MobileMenu