import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import SellPage from '../components/sellPage/SellPage'

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