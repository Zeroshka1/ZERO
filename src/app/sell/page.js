import React from 'react'
import Header from '../components/header/Header.jsx'
import Footer from '../components/footer/Footer.jsx'
import SellPage from '../components/sellPage/SellPage.jsx'

function Sell() {
  return (
    <>
      <Header/>
      <main className='container'>
        <SellPage/>
      </main>
      <Footer/>
    </>
  )
}

export default Sell