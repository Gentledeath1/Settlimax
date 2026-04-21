import React, { useState, useEffect } from 'react'
import { FiCopy, FiCheck, FiUsers, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDateTime, timeAgo } from '../../utils/helpers'
import { StatCard, Table, Pagination, Spinner } from '../shared/UI'

export function ReferralsPage() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({})
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/referrals?page=${page}`),
      api.get('/referrals/stats'),
    ]).then(([r, s]) => {
      setReferrals(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
      setStats(s.data.data || {})
    }).finally(() => setLoading(false))
  }, [page])

  const refLink = `${window.location.origin}/register?ref=${user?.referral_code}`
  const copy = () => {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="text-white font-medium">{r.name}</span> },
    { key: 'joined', label: 'Joined', render: r => <span className="text-white/50 text-xs">{timeAgo(r.created_at)}</span> },
    { key: 'invested', label: 'Invested', render: r => <span className="font-mono text-white/70">{formatCurrency(r.total_invested || 0, 0)}</span> },
    { key: 'bonus', label: 'Your Bonus', render: r => <span className="font-mono text-emerald-400">{formatCurrency(r.commission || 0)}</span> },
  ]

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Referrals</h1>
        <p className="text-white/40 text-sm mt-1">Earn ₦20 per signup + 5% on their investments</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Referrals" value={stats.total || 0} icon={FiUsers} color="brand" />
        <StatCard label="Referral Earnings" value={formatCurrency(stats.total_earnings || 0)} icon={FiDollarSign} color="emerald" />
        <StatCard label="Signup Bonuses" value={formatCurrency(stats.signup_bonuses || 0)} icon={FiDollarSign} color="amber" />
        <StatCard label="Commission Earned" value={formatCurrency(stats.commission || 0)} icon={FiDollarSign} color="rose" />
      </div>

      <div className="glass-card p-5">
        <p className="font-display font-semibold text-white mb-1">Your Referral Link</p>
        <p className="text-white/30 text-xs mb-3">Share this link to earn bonuses</p>
        <div className="flex gap-2">
          <input readOnly value={refLink} className="input-field flex-1 text-xs text-white/50" />
          <button onClick={copy} className="btn-primary px-4 py-2 flex items-center gap-1.5 text-sm whitespace-nowrap">
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-white/30 text-xs mt-2">Code: <span className="text-brand-400 font-mono">{user?.referral_code}</span></p>
      </div>

      <div>
        <h2 className="font-display font-semibold text-white mb-4">My Referrals ({stats.total || 0})</h2>
        <div className="glass-card overflow-hidden">
          <Table columns={columns} data={referrals} emptyMessage="No referrals yet. Share your link to get started!" />
          <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}

export function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/transactions?page=${page}&type=${type}`).then(r => {
      setTransactions(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setLoading(false))
  }, [page, type])

  const columns = [
    { key: 'description', label: 'Description', render: r => <span className="text-white text-sm">{r.description}</span> },
    { key: 'amount', label: 'Amount', render: r => (
      <span className={`font-mono font-semibold ${r.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {r.type === 'credit' ? '+' : '-'}{formatCurrency(r.amount)}
      </span>
    )},
    { key: 'type', label: 'Type', render: r => (
      <span className={r.type === 'credit' ? 'badge-success' : 'badge-danger'}>{r.type}</span>
    )},
    { key: 'created_at', label: 'Date', render: r => <span className="text-white/40 text-xs">{formatDateTime(r.created_at)}</span> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Transactions</h1>
          <p className="text-white/40 text-sm mt-1">All your account activity</p>
        </div>
        <select value={type} onChange={e => { setType(e.target.value); setPage(1) }}
          className="input-field w-auto text-sm">
          <option value="">All types</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <>
            <Table columns={columns} data={transactions} emptyMessage="No transactions found" />
            <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [passForm, setPassForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)

  const updateProfile = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/user/profile', form)
      await refreshUser()
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async e => {
    e.preventDefault()
    if (passForm.password !== passForm.password_confirmation) { toast.error('Passwords do not match'); return }
    setPassLoading(true)
    try {
      await api.put('/user/password', passForm)
      toast.success('Password changed!')
      setPassForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Profile Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Profile info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-display font-bold text-brand-400 text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg">{user?.name}</p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <p className="text-white/25 text-xs mt-0.5">Ref: <span className="text-brand-400 font-mono">{user?.referral_code}</span></p>
          </div>
        </div>

        <form onSubmit={updateProfile} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm block mb-1.5">Full name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1.5">Phone</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1.5">Email (read-only)</label>
            <input value={user?.email} readOnly className="input-field opacity-50 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><Spinner size="sm" />Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={updatePassword} className="space-y-4">
          {[
            { name: 'current_password', label: 'Current password' },
            { name: 'password', label: 'New password' },
            { name: 'password_confirmation', label: 'Confirm new password' },
          ].map(f => (
            <div key={f.name}>
              <label className="text-white/60 text-sm block mb-1.5">{f.label}</label>
              <input type="password" value={passForm[f.name]}
                onChange={e => setPassForm(p => ({ ...p, [f.name]: e.target.value }))}
                className="input-field" required />
            </div>
          ))}
          <button type="submit" disabled={passLoading} className="btn-outline flex items-center gap-2">
            {passLoading ? <><Spinner size="sm" />Updating...</> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
