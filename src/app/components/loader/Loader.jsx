import React from 'react'
import Image from 'next/image'
import styles from './loader.module.css'
import LoaderIco from '@/../public/images/loader.png'
const Loader = () => {
    return (
        <div className={styles.loaderWrapper}>
            <Image src={LoaderIco} width={50} height={50} />
        </div>
    )
}

export default Loader