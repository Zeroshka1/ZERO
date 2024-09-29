import Image from "next/image";
import LogoW from '@/../public/images/Logo_W.png';
import GitHub from '@/../public/images/github.png';
import Tellegram from '@/../public/images/tellegram.png';
import VK from '@/../public/images/vk.png';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className='container'>
        <div className={styles.logoInfo}>
          <div className={styles.logo}>
            <Image
              src={LogoW}
              width={33}
              height={53}
              alt="pep"
            />
            <h2>ZERO</h2>
          </div>

          <nav className={styles.socialMobile}>
            <a href="https://github.com/Zeroshka1">
              <Image
                width={20}
                height={20}
                alt="pep"
                src={GitHub}
              />
            </a>

            <a href="https://t.me/ZEROSHKEN">
              <Image
                width={20}
                height={20}
                alt="pep"
                src={Tellegram}
              />
            </a>

            <a href="https://vk.com/full_z">
              <Image
                width={20}
                height={20}
                alt="pep"
                src={VK}
              />
            </a>
          </nav>

          <nav className={styles.info}>
            <a href="/">Privacy Policy</a>
            <a href="/">Term & Conditions</a>
            <a href="/">About Us</a>
            <a href="/">Contact</a>
          </nav>
        </div>

        <div className={styles.line}></div>

        <div className={styles.copSoc}> 
          <p>© 2024 EATLY All Rights Reserved.</p>
          <nav className={styles.socialPC}>
            <a href="https://github.com/Zeroshka1">
              <Image
                width={20}
                height={20}
                alt="pep"
                src={GitHub}
              />
            </a>

            <a href="https://t.me/ZEROSHKEN">
              <Image
                width={20}
                height={20}
                alt="pep"
                src={Tellegram}
              />
            </a>

            <a href="https://vk.com/full_z">
              <Image
                width={20}
                height={20}
                alt="pep"
                src={VK}
              />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
