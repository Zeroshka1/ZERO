'use client';
import React, { useState } from 'react';
import styles from '../sellPage.module.css';
import Image from 'next/image';
import Loader from '../../loader/Loader'; // Подключаем лоадер

function FormSell() {
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('RUB');
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false); // Состояние попапа
    const [popupActive, setPopupActive] = useState(false); // Для управления классом active

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const triggerFileUpload = () => {
        document.getElementById('imageUploadInput').click();
    };

    const handleValidSize = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setSize(value ? Number(value) : '');
    };

    const handleValidPrice = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setPrice(value ? Number(value) : '');
    };

    const currency = [
        { currency: 'RUB' },
        { currency: 'USD' },
        { currency: 'EUR' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
    
        if (!user_id) {
            console.log('User ID not found');
            return;
        }
    
        if (!image) {
            alert('Пожалуйста, загрузите изображение.');
            return;
        }
    
        setIsLoading(true);
    
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
    
            try {
                const response = await fetch('/api/sell', {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        description,
                        size,
                        price,
                        currency: selectedCurrency,
                        image: base64String,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    setName('');
                    setDescription('');
                    setSize('');
                    setPrice('');
                    setImage(null);
                    setImagePreview(null);
                    setSelectedCurrency('RUB');
                    setIsSuccessPopupVisible(true);
                    setTimeout(() => {
                        setPopupActive(true);
                    }, 50);
                } else {
                    alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
                }
            } catch (error) {
                console.error('Ошибка при отправке формы:', error);
            }
    
            setIsLoading(false);
        };
    
        reader.readAsDataURL(image);
    };
    

    const handleClosePopup = () => {
        setPopupActive(false);
        setTimeout(() => {
            setIsSuccessPopupVisible(false); 
        }, 100);
    };

    return (
        <div>
            <form className={styles.formSellWrapper} onSubmit={handleSubmit}>
                <div className={styles.textFormWrapper}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength='10' placeholder='ArtWork Name' />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" cols="50" maxLength="130" placeholder='Enter Your Description' />
                    </div>

                    <div className={styles.priceSizeWrapper}>
                        <div className={`${styles.inputGroup} ${styles.sizeWrapper}`}>
                            <label htmlFor="size">Size</label>
                            <div className={styles.sizeContainer}>
                                <input type="text" value={size || ''} maxLength={4} onChange={handleValidSize} required placeholder='100' />
                                <span>x</span>
                                <input type="text" value={size || ''} maxLength={4} onChange={handleValidSize} required placeholder='100' />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="price">Price</label>
                            <div className={styles.priceWrapper}>
                                <select onChange={(e) => setSelectedCurrency(e.target.value)} name="currency" id="currency-select">
                                    {currency.map((value, index) => (
                                        <option value={value.currency} key={index}>{value.currency}</option>
                                    ))}
                                </select>
                                <input type="text" value={price || ''} required placeholder='Price' maxLength={7} onChange={handleValidPrice} />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className={styles.loaderWrapper}>
                            <Loader />
                        </div> // Показываем лоадер во время отправки
                    ) : (
                        <button type="submit" className={`${styles.btnCreateNFT} blackBtn`}>Create</button>
                    )}
                </div>

                <div className={styles.uploadImgWrapper}>
                    {imagePreview ? (
                        <div className={styles.imgAndBlurSell}>
                            <Image src={imagePreview} alt="Uploaded image" width={400} height={400} className={styles.imgSell} />
                            <Image src={imagePreview} alt="Uploaded image" width={400} height={400} className={styles.BlurSell} />
                        </div>
                    ) : (
                        <div className={styles.placeholderSell}>
                            <p>Upload an image<br /> (format: PNG, JPG, GIF, WEBP)</p>
                        </div>
                    )}

                    <input type="file" id="imageUploadInput" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <button type="button" className={`${styles.btnUploadImage} blackBtn`} onClick={triggerFileUpload}>Upload</button>
                </div>
            </form>

            {/* Попап с успешным сообщением */}
            {isSuccessPopupVisible && (
                <div className={styles.wrapperBlur}>
                    <div className={`${styles.overlay} ${popupActive ? styles.active : ''}`}></div>
                    <div className={styles.popupContent}>
                        <h2>NFT successfully listed!</h2>
                        <button onClick={handleClosePopup} className="blackBtn">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormSell;
