import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import AccountPage from '../components/account/AccountPage'

const Account = () => {
  return (
    <>
    <Header />
    <main className="container">
        <AccountPage/>
    </main>
    <Footer />
  </>
  )
}

export default Account