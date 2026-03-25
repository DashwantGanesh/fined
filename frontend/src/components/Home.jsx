import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import LoanCompareWidget from './LoanCompareWidget'
import WhyFined from './WhyFined'
import HowItWorks from './HowItWorks'
import EMICalculator from './EMICalculator'
import useGetAllLoans from '@/hooks/useGetAllLoans'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const {user}= useSelector(store=>store.auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user?.role === 'bank'){
      navigate("/bank/loans");
    }
  },[]);
  useGetAllLoans();
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