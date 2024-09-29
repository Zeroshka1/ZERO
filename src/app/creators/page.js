import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import CreatorsPage from '../components/creatorsPage/CreatorsPage'

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