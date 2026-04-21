import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrendingUp, FiArrowUpCircle, FiArrowDownCircle, FiUsers, FiCopy, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDateTime, timeAgo } from '../../utils/helpers'
import { StatCard, StatusBadge, Spinner } from '../shared/UI'

export default function DashboardOverview() {
  const { user, refreshUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentTx, setRecentTx] = useState([])
  const [activeInvestments, setActiveInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/transactions?per_page=5'),
      api.get('/investments?status=active&per_page=3'),
    ]).then(([s, t, inv]) => {
      setStats(s.data.data)
      setRecentTx(t.data.data.data || [])
      setActiveInvestments(inv.data.data.data || [])
    }).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false))
    refreshUser()
  }, [])

  const refLink = `${window.location.origin}/register?ref=${user?.referral_code}`
  const copyRef = () => {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Wallet Balance" value={formatCurrency(user?.wallet_balance || 0)} icon={FiArrowDownCircle} color="brand" />
        <StatCard label="Total Earnings" value={formatCurrency(stats?.total_earnings || 0)} icon={FiTrendingUp} color="emerald" />
        <StatCard label="Total Withdrawn" value={formatCurrency(stats?.total_withdrawn || 0)} icon={FiArrowUpCircle} color="amber" />
        <StatCard label="Total Referrals" value={stats?.total_referrals || 0} icon={FiUsers} color="rose" sub={`${formatCurrency(stats?.referral_earnings || 0)} earned`} />
      </div>

      {/* Active investments */}
      {activeInvestments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Active Investments</h2>
            <Link to="/dashboard/invest" className="text-brand-400 text-sm hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeInvestments.map(inv => {
              const progress = Math.min(100, ((inv.days_elapsed || 0) / 25) * 100)
              return (
                <div key={inv.id} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-semibold text-white">{inv.plan_name}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="text-emerald-400 font-mono font-bold text-xl mb-1">{formatCurrency(inv.daily_income, 0)}<span className="text-white/30 text-sm font-normal">/day</span></p>
                  <p className="text-white/40 text-xs mb-3">Total: {formatCurrency(inv.total_return, 0)} · Day {inv.days_elapsed || 0}/25</p>
                  <div className="w-full bg-white/8 rounded-full h-1.5">
                    <div className="bg-brand-gradient h-1.5 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Referral link */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-white">Your Referral Link</h3>
            <p className="text-white/40 text-xs mt-0.5">Earn ₦20 per signup + 5% on their investments</p>
          </div>
          <span className="badge-info">Code: {user?.referral_code}</span>
        </div>
        <div className="flex gap-2">
          <input readOnly value={refLink} className="input-field text-xs flex-1 text-white/50" />
          <button onClick={copyRef} className="btn-primary px-4 py-2 flex items-center gap-1.5 text-sm whitespace-nowrap">
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Recent Transactions</h2>
          <Link to="/dashboard/history" className="text-brand-400 text-sm hover:underline">See all</Link>
        </div>
        <div className="glass-card overflow-hidden">
          {recentTx.length === 0 ? (
            <p className="text-center py-10 text-white/30 text-sm">No transactions yet</p>
          ) : (
            <div className="divide-y divide-white/5">
              {recentTx.map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-white font-medium text-sm">{tx.description}</p>
                    <p className="text-white/30 text-xs mt-0.5">{timeAgo(tx.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-semibold text-sm ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
