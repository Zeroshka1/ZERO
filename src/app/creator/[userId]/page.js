import React from 'react'
import CreatorProfile from '@/app/components/creatorProfile/CreatorProfile'
import Header from '@/app/components/header/Header'
import Footer from '@/app/components/footer/Footer'

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
