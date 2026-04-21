import React, { useState, useEffect } from 'react'
import { FiTrendingUp, FiClock, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { PLANS, formatCurrency } from '../../utils/helpers'
import { Modal, Spinner } from '../shared/UI'

export default function InvestPage() {
  const { user, refreshUser } = useAuth()
  const [activeInvestments, setActiveInvestments] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get('/investments?status=active').then(r => {
      setActiveInvestments(r.data.data.data || [])
    }).finally(() => setFetching(false))
  }, [])

  const activePlanTiers = activeInvestments.map(i => i.tier)

  const invest = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await api.post('/investments', { tier: selected.tier })
      toast.success(`${selected.name} activated! Income starts in 18 hours.`)
      setConfirmOpen(false)
      await refreshUser()
      const r = await api.get('/investments?status=active')
      setActiveInvestments(r.data.data.data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Investment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Invest</h1>
        <p className="text-white/40 text-sm mt-1">Choose a stack to activate. Balance: <span className="text-white font-medium">{formatCurrency(user?.wallet_balance || 0)}</span></p>
      </div>

      {/* Active investments summary */}
      {activeInvestments.length > 0 && (
        <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5">
          <p className="text-emerald-400 font-semibold text-sm mb-2">Active Stacks ({activeInvestments.length})</p>
          <div className="flex flex-wrap gap-2">
            {activeInvestments.map(inv => (
              <span key={inv.id} className="badge-success">{inv.plan_name} · {formatCurrency(inv.daily_income, 0)}/day</span>
            ))}
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => {
          const isActive = activePlanTiers.includes(plan.tier)
          const canAfford = (user?.wallet_balance || 0) >= plan.cost
          const roi = ((plan.total - plan.cost) / plan.cost * 100).toFixed(0)
          const highlight = plan.tier === 6 // featured plan

          return (
            <div key={plan.tier}
              className={`glass-card p-5 transition-all duration-200 relative
                ${highlight ? 'border-brand-500/40 ring-1 ring-brand-500/20' : ''}
                ${isActive ? 'border-emerald-500/30 bg-emerald-500/5' : canAfford ? 'hover:border-white/20 cursor-pointer hover:bg-white/5' : 'opacity-50 cursor-not-allowed'}
              `}
              onClick={() => {
                if (!isActive && canAfford) {
                  setSelected(plan)
                  setConfirmOpen(true)
                } else if (!canAfford) {
                  toast.error(`Insufficient balance. Need ${formatCurrency(plan.cost, 0)}`)
                }
              }}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-display font-semibold px-3 py-0.5 rounded-full">
                  Popular
                </div>
              )}
              {isActive && (
                <div className="absolute top-3 right-3">
                  <span className="badge-success flex items-center gap-1"><FiCheck size={10} />Active</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center font-display font-bold text-brand-400">
                  {plan.tier}
                </div>
                <span className="badge-info">{roi}% ROI</span>
              </div>

              <h3 className="font-display font-bold text-white text-xl mb-1">{plan.name}</h3>
              <p className="text-white/40 text-xs mb-4">25-day cycle · Income every 18h</p>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Cost</span>
                  <span className="text-white font-mono font-semibold">{formatCurrency(plan.cost, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Daily income</span>
                  <span className="text-emerald-400 font-mono font-semibold">{formatCurrency(plan.daily, 0)}</span>
                </div>
                <div className="flex justify-between border-t border-white/8 pt-2.5">
                  <span className="text-white/40 text-sm">Total return</span>
                  <span className="text-gold-400 font-mono font-bold">{formatCurrency(plan.total, 0)}</span>
                </div>
              </div>

              {!isActive && canAfford && (
                <button className="btn-primary w-full mt-4 py-2.5 text-sm flex items-center justify-center gap-2">
                  <FiTrendingUp size={14} /> Activate Stack
                </button>
              )}
              {!canAfford && !isActive && (
                <div className="mt-4 text-center text-white/30 text-xs">Need {formatCurrency(plan.cost - (user?.wallet_balance || 0), 0)} more</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => !loading && setConfirmOpen(false)} title="Confirm Investment">
        {selected && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-2">
              {[
                ['Plan', selected.name],
                ['Cost', formatCurrency(selected.cost, 0)],
                ['Daily income', formatCurrency(selected.daily, 0)],
                ['Total return', formatCurrency(selected.total, 0)],
                ['Cycle', '25 days'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40 text-sm">{k}</span>
                  <span className="text-white font-mono text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-white/30 text-xs">{formatCurrency(selected.cost, 0)} will be deducted from your wallet balance.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOpen(false)} disabled={loading} className="btn-secondary flex-1">Cancel</button>
              <button onClick={invest} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <><Spinner size="sm" />Processing...</> : 'Confirm & Invest'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
