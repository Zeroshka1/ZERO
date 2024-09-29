'use client';
import Image from "next/image";
import Logo from '../../../../public/images/Logo.png';
import styles from './header.module.css';
import MobileMenu from "./mobileMenu/MobileMenu";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from "./searchBar/SearchBar";

const Header = () => {
  const menuItemsData = [
    { title: 'Discover', url: '/discover' },
    { title: 'Creators', url: '/creators' },
    { title: 'Sell', url: '/sell' },
    { title: 'Account', url: '/account' },
  ];


  const pathname = usePathname();

  return (
    <>
      <header className={`${styles.headerWrapper} PC container`}>

        <div className={styles.logoNav}>

          <Link href='/'>
            <Image
              width={33}
              height={53}
              src={Logo}
              alt="pep"
            />
          </Link>



          <nav>
            <ul className={styles.navList}>
              {menuItemsData.map((menu, index) => (
                <li key={index}>
                  <Link href={menu.url} legacyBehavior>
                    <a className={pathname === menu.url ? styles.activeLink : ''}>
                      {menu.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>


        <div className={styles.searchConnectBtn}>

          <SearchBar />

          <button className={`${styles.connetWalletBtn} blackBtn disabled`}>Connect Wallet</button>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;
