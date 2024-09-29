import React from 'react'
import Header from '../components/header/Header.jsx'
import Footer from '../components/footer/Footer.jsx'
import DiscoverPage from '../components/discover/DiscoverPage.jsx'

const Discover = () => {
  return (
    <>
    <Header />
    <main className="container">
        <DiscoverPage/>
    </main>
    <Footer />
  </>
  )
}

export default Discover