import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrendingUp, FiClock, FiArrowRight } from 'react-icons/fi'
import { PLANS, formatCurrency } from '../../utils/helpers'

export default function PlansSection() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="plans" className="py-24 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-brand-400 font-body font-semibold text-sm tracking-widest uppercase mb-3">Investment Plans</p>
          <h2 className="section-title">Income Drops Every <span className="text-gradient">18 Hours</span></h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Choose a stack that matches your budget. All plans run 25-day cycles with daily income drops.
          </p>
        </div>

        {/* Plan summary table header */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 mb-3 text-white/30 text-xs font-body font-medium uppercase tracking-widest">
          <span>Plan</span>
          <span className="text-right">Cost</span>
          <span className="text-right">Daily Income</span>
          <span className="text-right">Total Return</span>
          <span className="text-right">Cycle</span>
        </div>

        <div className="space-y-2">
          {PLANS.map((plan, i) => {
            const roi = ((plan.total - plan.cost) / plan.cost * 100).toFixed(0)
            const isSelected = selected === i
            return (
              <div
                key={plan.tier}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`glass-card-hover cursor-pointer transition-all duration-300 ${isSelected ? 'border-brand-500/50 bg-brand-500/5 shadow-lg shadow-brand-500/10' : ''}`}
              >
                {/* Mobile layout */}
                <div className="md:hidden p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${isSelected ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/60'}`}>
                        {plan.tier}
                      </div>
                      <span className="font-display font-semibold text-white">{plan.name}</span>
                    </div>
                    <span className="badge-info">{roi}% ROI</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-white/30 text-xs mb-0.5">Cost</p>
                      <p className="text-white font-mono text-sm font-medium">{formatCurrency(plan.cost, 0)}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-0.5">Daily</p>
                      <p className="text-emerald-400 font-mono text-sm font-medium">{formatCurrency(plan.daily, 0)}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-0.5">Total</p>
                      <p className="text-gold-400 font-mono text-sm font-medium">{formatCurrency(plan.total, 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-5 gap-4 items-center px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${isSelected ? 'bg-brand-500 text-white' : 'bg-white/8 text-white/50'}`}>
                      {plan.tier}
                    </div>
                    <span className="font-display font-semibold text-white">{plan.name}</span>
                  </div>
                  <p className="text-right font-mono text-white/80">{formatCurrency(plan.cost, 0)}</p>
                  <p className="text-right font-mono text-emerald-400 font-semibold">{formatCurrency(plan.daily, 0)}</p>
                  <p className="text-right font-mono text-gold-400 font-semibold">{formatCurrency(plan.total, 0)}</p>
                  <div className="text-right flex items-center justify-end gap-2">
                    <FiClock size={14} className="text-white/30" />
                    <span className="text-white/60 text-sm">{plan.cycle} days</span>
                    <span className="badge-info ml-2">{roi}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-5 glass-card border-brand-500/20 bg-brand-500/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm font-body"> 
                <span className="text-brand-400 font-semibold">Min withdrawal: ₦800 · </span>
                Welcome bonus: ₦800 · 
                15% withdrawal charge · 
                Referral: 20% + 5%
              </p>
            </div>
            <Link to="/register" className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm">
              Invest Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
