"use client";
import { useEffect, useState } from 'react';
import styles from '../homePage.module.css'; 
import Image from 'next/image';
import decorOne from '@/../public/images/arrow.png';

function StartBaner() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [animating, setAnimating] = useState(false); 


    const fetchNFTs = async () => {
        try {
            const response = await fetch('/api/get-nfts');
            const data = await response.json();

            if (response.ok) {

                const shuffled = data.sort(() => 0.5 - Math.random()); 
                const selectedSlides = shuffled.slice(0, 2);
                setSlides(selectedSlides);
            } else {
                console.error('Failed to load NFTs:', data.error);
            }
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };


    useEffect(() => {
        fetchNFTs();
    }, []);

    const goToNextSlide = () => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            setAnimating(false);
        }, 500);
    };

    const goToPreviousSlide = () => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? slides.length - 1 : prevIndex - 1
            );
            setAnimating(false);
        }, 500);
    };

    return (
        <div className={`${styles.startBanerWrapper}`}>
            <div className={styles.textBtnBlock}>
                <div className={styles.line}></div>
                <div className={styles.textBlock}>
                    <h1>Discover And <br /> Create NFTs</h1>
                    <p>Discover, Create and Sell NFTs <br />On my <span>NFT Marketplace.</span></p>
                </div>
                <div className={styles.btnBlock}>
                    <button className='blackBtn'><a href="/discover">Explore More</a></button>
                    <button className='whiteBtn'><a href="/sell">Create NFT</a></button>
                </div>
            </div>

            {slides.length > 0 && ( 
                <div className={styles.sliderWrapper}>
                    <div className={styles.decorSlider}>
                        <Image
                            width={150}
                            height={150}
                            alt='pep'
                            src={decorOne}
                            className={styles.decoreSliderArrow}
                        />
                        <div className={styles.decoreSliderDot}></div>
                    </div>
                    <div className={styles.slider}>
                        <div className={`${styles.slide} ${styles.currentSlide} ${animating ? styles.animating : ''}`}>
                            <Image
                                src={slides[currentIndex].image_url}
                                alt={`Slide ${currentIndex + 1}`}
                                width={400}
                                height={400}
                                className={`${animating ? styles.fadeIn : ''} ${styles.sliderBlurImage}`}
                            />
                            <Image
                                src={slides[currentIndex].image_url}
                                alt={`Slide ${currentIndex + 1}`}
                                width={400}
                                height={400}
                                className={`${animating ? styles.fadeIn : ''} ${styles.currentImageContent}`}
                            />
                        </div>

                        {slides.length > 1 && (
                            <div className={`${styles.slide} ${styles.nextSlide} ${animating ? styles.fadeOut : ''}`}>
                                <Image
                                    src={slides[(currentIndex + 1) % slides.length].image_url}
                                    alt={`Slide ${(currentIndex + 1) % slides.length + 1}`}
                                    width={300}
                                    height={300}
                                    className={styles.sliderBlurImage}
                                />
                                <Image
                                    src={slides[(currentIndex + 1) % slides.length].image_url}
                                    alt={`Slide ${(currentIndex + 1) % slides.length + 1}`}
                                    width={300}
                                    height={300}
                                    className={styles.nextImageContent}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.sliderBtns}>
                        <button
                            onClick={goToPreviousSlide}
                            className={`${styles.sliderBtnL} ${currentIndex === 0 ? styles.noActive : styles.active}`}
                            disabled={currentIndex === 0}
                        ></button>
                        <div></div>
                        <button
                            onClick={goToNextSlide}
                            className={`${styles.sliderBtnR} ${currentIndex === slides.length - 1 ? styles.noActive : styles.active}`}
                            disabled={currentIndex === slides.length - 1}
                        ></button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StartBaner;
