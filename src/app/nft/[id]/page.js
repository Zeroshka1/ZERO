import Footer from '@/app/components/footer/Footer.jsx';
import Header from '@/app/components/header/Header.jsx';
import NFTPage from '@/app/components/nftPage/NftPage.jsx';
import React from 'react';

const NftPage = ({ params }) => {
  return (
    <>
      <Header />
      <main className='container'>
        <NFTPage params={params} />
      </main>
      <Footer />
    </>
  )
};

export default NftPage;
