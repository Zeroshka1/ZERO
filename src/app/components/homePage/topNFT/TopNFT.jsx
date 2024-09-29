'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../homePage.module.css';
import Link from 'next/link';
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import Loader from '../../loader/Loader';

const NFTSlider = () => {
    const [nfts, setNfts] = useState([]);


    const options = { loop: true };
    const [emblaRef, emblaApi] = useEmblaCarousel(options);


    useEffect(() => {
        async function fetchNFTs() {
            try {
                const res = await fetch('/api/get-nfts');
                const data = await res.json();
                setNfts(data.slice(0, 15));
            } catch (error) {
                console.error("Ошибка при получении данных NFT:", error);
            }
        }
        fetchNFTs();
    }, []);

    const {
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi);

    return (
        <section className="embla">
            <div className={styles.sliderCenterBlock}>
                <h1 className={styles.topNftTitle}>Weekly - Top NFT</h1>
            </div>
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {nfts.length > 0 ? (
                        nfts.map((nft, index) => (
                            <div key={index} className={styles.nft_slide}>
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
                    ) : (
                        <div className={styles.loaderWrapper}>
                            <Loader/>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.sliderCenterBlock}>
                <div className={styles.sliderBtns}>
                    <PrevButton className={`${styles.sliderBtnL} ${styles.active}`} onClick={onPrevButtonClick} />
                    <div></div>
                    <NextButton className={`${styles.sliderBtnR} ${styles.active}`} onClick={onNextButtonClick} />
                </div>
            </div>
        </section>
    );
};

export default NFTSlider;
