import React from 'react'
import Header from '../components/header/Header.jsx'
import Footer from '../components/footer/Footer.jsx'
import CreatorsPage from '../components/creatorsPage/CreatorsPage.jsx'

const Ceators = () => {
  return (
    <>
    <Header />
    <main className="container">
        <CreatorsPage/>
    </main>
    <Footer />
  </>
  )
}

export default Ceators