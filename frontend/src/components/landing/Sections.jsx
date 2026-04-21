import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUserPlus, FiCreditCard, FiTrendingUp, FiDollarSign,
  FiUsers, FiGift, FiChevronDown, FiChevronUp,
  FiSend, FiInstagram, FiTwitter
} from 'react-icons/fi'
import Logo from '../shared/Logo'
import { formatCurrency, REFERRAL_BONUS, REFERRAL_PERCENT, WELCOME_BONUS } from '../../utils/helpers'

export function HowItWorksSection() {
  const steps = [
    { icon: FiUserPlus, num: '01', title: 'Create Account', desc: `Register in seconds. Get ${formatCurrency(WELCOME_BONUS, 0)} welcome bonus instantly on signup plus ₦50 daily login reward.` },
    { icon: FiCreditCard, num: '02', title: 'Fund & Invest', desc: 'Transfer to our bank account, upload proof of payment and admin approves your wallet funding.' },
    { icon: FiTrendingUp, num: '03', title: 'Pick a Stack', desc: 'Choose from Stack 1–12 based on your budget. Each plan earns daily income over a 25-day cycle.' },
    { icon: FiDollarSign, num: '04', title: 'Withdraw Earnings', desc: 'Request withdrawals once you hit ₦800. Admin processes payments directly to your bank.' },
  ]
  return (
    <section id="how" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14"> 
          <p className="text-brand-400 font-body font-semibold text-sm tracking-widest uppercase mb-3">Process</p>
          <h2 className="section-title">How StackEarnx Works</h2>
          <p className="section-subtitle">Four simple steps to start earning</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="glass-card p-6 relative group">
              <div className="absolute -top-3 -right-3 font-display font-bold text-5xl text-white/5 select-none">{step.num}</div>
              <div className="bg-brand-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/25 transition-colors">
                <step.icon className="text-brand-400" size={22} />
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ReferralSection() {
  return (
    <section id="referral" className="py-24 bg-dark-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-brand-400 font-body font-semibold text-sm tracking-widest uppercase mb-3">Referrals</p>
          <h2 className="section-title">Earn More by Sharing</h2>
          <p className="section-subtitle">Two-tier referral system that pays you passively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: FiGift, title: 'Welcome Bonus', value: formatCurrency(WELCOME_BONUS, 0), desc: 'Get credited instantly when you register a new account', color: 'emerald' },
            { icon: FiUsers, title: 'Direct Referral', value: `${REFERRAL_PERCENT}% Commission`, desc: 'Earn 5% of every investment your direct referral makes', color: 'brand' },
            { icon: FiSend, title: 'Referral Signup Bonus', value: formatCurrency(REFERRAL_BONUS, 0), desc: 'Earn ₦20 instantly when anyone registers with your link', color: 'amber' },
          ].map((item, i) => {
            const colors = {
              emerald: 'bg-emerald-500/10 text-emerald-400',
              brand:   'bg-brand-500/10 text-brand-400',
              amber:   'bg-amber-500/10 text-amber-400',
            }
            return (
              <div key={i} className="glass-card p-6 text-center">
                <div className={`${colors[item.color]} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-display font-bold text-white text-2xl mb-1">{item.value}</h3>
                <p className="text-brand-400 font-semibold text-sm mb-2">{item.title}</p>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="glass-card p-6 text-center">
          <p className="text-white/60 text-sm mb-4">Your unique referral link will be available after registration</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            <FiUsers size={16} /> Start Referring & Earning
          </Link>
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'How do I fund my StackEarnx wallet?', a: 'Transfer to our designated bank account and upload your proof of payment. Our admin team reviews and credits your wallet within a few hours.' },
    { q: 'When are income drops released?', a: 'Income is released every 18 hours. Once you activate a plan, the clock starts and you receive daily income throughout the 25-day cycle.' },
    { q: 'What is the minimum withdrawal amount?', a: 'The minimum withdrawal is ₦800. A 15% charge applies to all withdrawals, which covers processing fees.' },
    { q: 'How does the referral system work?', a: 'You earn ₦20 instantly when someone registers with your link. You also earn 5% commission on their investments, giving you passive income.' },
    { q: 'How long does withdrawal take?', a: 'Withdrawals are processed manually. Most requests are fulfilled within 24 hours during business days.' },
    { q: 'Can I run multiple stacks simultaneously?', a: 'Yes! You can invest in multiple stacks at the same time to maximise your daily earnings.' },
    { q: 'What happens after a 25-day cycle completes?', a: 'You can reinvest your principal into any stack again or withdraw your balance. Your account remains active.' },
  ]
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-brand-400 font-body font-semibold text-sm tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="section-title">Common Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`glass-card overflow-hidden transition-all duration-200 ${open === i ? 'border-brand-500/30' : ''}`}>
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-display font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                {open === i ? <FiChevronUp className="text-brand-400 shrink-0" size={18} /> : <FiChevronDown className="text-white/40 shrink-0" size={18} />}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/10 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1 lg:col-span-2">
            <Logo size="md" className="mb-4" />
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              StackEarnx is Nigeria's structured income platform. Earn every 18 hours with our proven investment stacks.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiTwitter, FiInstagram, FiSend].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-500/20 flex items-center justify-center text-white/40 hover:text-brand-400 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm mb-4">Platform</p>
            <ul className="space-y-2.5">
              {['#plans', '#how', '#referral', '#faq'].map((href, i) => (
                <li key={i}><a href={href} className="text-white/40 hover:text-white text-sm transition-colors">
                  {['Investment Plans', 'How It Works', 'Referral Program', 'FAQ'][i]}
                </a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm mb-4">Account</p>
            <ul className="space-y-2.5">
              {['/login', '/register', '/dashboard'].map((href, i) => (
                <li key={i}><Link to={href} className="text-white/40 hover:text-white text-sm transition-colors">
                  {['Login', 'Register', 'Dashboard'][i]}
                </Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-body">© {new Date().getFullYear()} StackEarnx. All rights reserved.</p>
          <p className="text-white/25 text-xs">Investment involves risk. Past returns do not guarantee future performance.</p>
        </div>
      </div>
    </footer>
  )
}
