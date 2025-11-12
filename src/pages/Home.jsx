import React from 'react';
import Hero from '../components/Hero';
import FeaturesCards from '../components/FeaturesCards';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesCards />
      <Footer />
    </>
  );
}

export default Home;
