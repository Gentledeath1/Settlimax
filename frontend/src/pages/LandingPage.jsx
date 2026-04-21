import React from 'react'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import PlansSection from '../components/landing/PlansSection'
import { HowItWorksSection, ReferralSection, FAQSection, Footer } from '../components/landing/Sections'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <HeroSection />
      <PlansSection />
      <HowItWorksSection />
      <ReferralSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
