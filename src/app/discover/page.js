import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import DiscoverPage from '../components/discover/DiscoverPage'

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