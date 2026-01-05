import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import LoanCompareWidget from './LoanCompareWidget'
import WhyFined from './WhyFined'
import HowItWorks from './HowItWorks'
import EMICalculator from './EMICalculator'

const Home = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <LoanCompareWidget />
        <WhyFined />
        <HowItWorks />
        <EMICalculator />
    </div>
  )
}

export default Home