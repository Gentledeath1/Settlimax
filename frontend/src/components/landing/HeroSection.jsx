import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiClock, FiUsers } from 'react-icons/fi'
import { formatCurrency, WELCOME_BONUS, INCOME_INTERVAL_HOURS, REFERRAL_PERCENT } from '../../utils/helpers'

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gold-500/10 rounded-full blur-xl animate-float" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-brand-300 text-sm font-body font-medium">
            Earn every {INCOME_INTERVAL_HOURS} hours · {formatCurrency(WELCOME_BONUS)} welcome bonus
          </span>
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
          Grow Your Money<br />
          <span className="text-gradient">Every 18 Hours</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl font-body max-w-2xl mx-auto mb-10 leading-relaxed">
          StackEarnx is Nigeria's leading income platform. Invest in any of our 12 structured stacks,
          earn guaranteed returns, and build wealth with referrals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
            Start Earning Now <FiArrowRight size={18} />
          </Link>
          <a href="#plans" className="btn-secondary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
            View Investment Plans
          </a>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { icon: FiClock, label: 'Income Cycle', value: '18 Hours' },
            { icon: FiShield, label: 'Min Withdrawal', value: '₦800' },
            { icon: FiUsers, label: 'Referral Bonus', value: `${REFERRAL_PERCENT}%` },
          ].map(stat => (
            <div key={stat.label} className="glass-card p-4 flex flex-col items-center gap-2">
              <stat.icon className="text-brand-400" size={20} />
              <p className="font-display font-bold text-white text-lg">{stat.value}</p>
              <p className="text-white/40 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-xs font-body">Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  )
}
