import React from 'react'
import CreatorProfile from '@/app/components/creatorProfile/CreatorProfile.jsx'
import Header from '@/app/components/header/Header.jsx'
import Footer from '@/app/components/footer/Footer.jsx'

const Creator = ({ params }) => {
  const { userId } = params;

  return (
    <>
      <Header />
      <main className="container">
        <CreatorProfile userId={userId} />
      </main>
      <Footer />
    </>
  )
}

export default Creator;
