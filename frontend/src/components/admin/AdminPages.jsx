import React, { useState, useEffect } from 'react'
import { FiUsers, FiTrendingUp, FiArrowDownCircle, FiArrowUpCircle, FiCheck, FiX, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { formatCurrency, formatDateTime, timeAgo } from '../../utils/helpers'
import { StatCard, StatusBadge, Table, Pagination, Modal, Spinner, EmptyState } from '../shared/UI'

/* ─── ADMIN OVERVIEW ─── */
export function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [pendingDeposits, setPendingDeposits] = useState([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/deposits?status=pending&per_page=5'),
      api.get('/admin/withdrawals?status=pending&per_page=5'),
    ]).then(([s, d, w]) => {
      setStats(s.data.data)
      setPendingDeposits(d.data.data.data || [])
      setPendingWithdrawals(w.data.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Admin Overview</h1>
        <p className="text-white/40 text-sm mt-1">Platform statistics at a glance</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.total_users || 0} icon={FiUsers} color="brand" />
        <StatCard label="Total Deposits" value={formatCurrency(stats?.total_deposits || 0)} icon={FiArrowDownCircle} color="emerald" />
        <StatCard label="Total Withdrawals" value={formatCurrency(stats?.total_withdrawals || 0)} icon={FiArrowUpCircle} color="amber" />
        <StatCard label="Active Investments" value={stats?.active_investments || 0} icon={FiTrendingUp} color="rose" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-white">Pending Deposits</h2>
            <span className="badge-warning">{stats?.pending_deposits || 0} pending</span>
          </div>
          <div className="glass-card overflow-hidden">
            {pendingDeposits.length === 0 ? (
              <p className="py-8 text-center text-white/30 text-sm">No pending deposits</p>
            ) : (
              <div className="divide-y divide-white/5">
                {pendingDeposits.map(d => (
                  <div key={d.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{d.user?.name}</p>
                      <p className="text-white/30 text-xs">{timeAgo(d.created_at)}</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(d.amount, 0)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-white">Pending Withdrawals</h2>
            <span className="badge-warning">{stats?.pending_withdrawals || 0} pending</span>
          </div>
          <div className="glass-card overflow-hidden">
            {pendingWithdrawals.length === 0 ? (
              <p className="py-8 text-center text-white/30 text-sm">No pending withdrawals</p>
            ) : (
              <div className="divide-y divide-white/5">
                {pendingWithdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{w.user?.name}</p>
                      <p className="text-white/30 text-xs">{w.bank_name} · {timeAgo(w.created_at)}</p>
                    </div>
                    <span className="font-mono text-rose-400 font-semibold">{formatCurrency(w.amount, 0)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── ADMIN USERS ─── */
export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [creditModal, setCreditModal] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditLoading, setCreditLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/admin/users?page=${page}&search=${search}`).then(r => {
      setUsers(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setLoading(false))
  }, [page, search])

  const credit = async () => {
    if (!creditAmount || isNaN(creditAmount)) { toast.error('Enter valid amount'); return }
    setCreditLoading(true)
    try {
      await api.post(`/admin/users/${selected.id}/credit`, { amount: creditAmount })
      toast.success(`${formatCurrency(creditAmount)} credited to ${selected.name}`)
      setCreditModal(false)
      setCreditAmount('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setCreditLoading(false) }
  }

  const toggleStatus = async (user) => {
    try {
      await api.patch(`/admin/users/${user.id}/toggle-status`)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u))
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`)
    } catch { toast.error('Failed') }
  }

  const columns = [
    { key: 'name', label: 'Name', render: r => (
      <div><p className="text-white font-medium text-sm">{r.name}</p><p className="text-white/30 text-xs">{r.email}</p></div>
    )},
    { key: 'balance', label: 'Balance', render: r => <span className="font-mono text-white">{formatCurrency(r.wallet_balance)}</span> },
    { key: 'status', label: 'Status', render: r => <span className={r.is_active ? 'badge-success' : 'badge-danger'}>{r.is_active ? 'Active' : 'Inactive'}</span> },
    { key: 'joined', label: 'Joined', render: r => <span className="text-white/40 text-xs">{formatDateTime(r.created_at)}</span> },
    { key: 'actions', label: '', render: r => (
      <div className="flex gap-2">
        <button onClick={() => { setSelected(r); setCreditModal(true) }} className="btn-outline py-1 px-2.5 text-xs">Credit</button>
        <button onClick={() => toggleStatus(r)} className={`py-1 px-2.5 text-xs rounded-lg border transition-all ${r.is_active ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
          {r.is_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Users</h1>
          <p className="text-white/40 text-sm mt-1">{meta.total || 0} total users</p>
        </div>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name or email..."
          className="input-field w-64 text-sm" />
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <>
            <Table columns={columns} data={users} emptyMessage="No users found" />
            <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
          </>
        )}
      </div>

      <Modal open={creditModal} onClose={() => !creditLoading && setCreditModal(false)} title={`Credit: ${selected?.name}`}>
        <div className="space-y-4">
          <p className="text-white/50 text-sm">Current balance: <span className="text-white font-semibold">{formatCurrency(selected?.wallet_balance || 0)}</span></p>
          <div>
            <label className="text-white/60 text-sm block mb-1.5">Amount to credit (₦)</label>
            <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="input-field" placeholder="Enter amount" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCreditModal(false)} disabled={creditLoading} className="btn-secondary flex-1">Cancel</button>
            <button onClick={credit} disabled={creditLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {creditLoading ? <><Spinner size="sm" />Crediting...</> : 'Credit Wallet'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ─── ADMIN DEPOSITS ─── */
export function AdminDeposits() {
  const [deposits, setDeposits] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [proofModal, setProofModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => { fetch() }, [page, status])

  const fetch = () => {
    setLoading(true)
    api.get(`/admin/deposits?page=${page}&status=${status}`).then(r => {
      setDeposits(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setLoading(false))
  }

  const action = async (id, act) => {
    setActionLoading(true)
    try {
      await api.patch(`/admin/deposits/${id}`, { status: act, admin_note: note })
      toast.success(`Deposit ${act}`)
      setProofModal(false)
      setNote('')
      fetch()
    } catch { toast.error('Action failed') } finally { setActionLoading(false) }
  }

  const columns = [
    { key: 'user', label: 'User', render: r => <div><p className="text-white text-sm">{r.user?.name}</p><p className="text-white/30 text-xs">{r.user?.email}</p></div> },
    { key: 'amount', label: 'Amount', render: r => <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(r.amount, 0)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'date', label: 'Date', render: r => <span className="text-white/40 text-xs">{formatDateTime(r.created_at)}</span> },
    { key: 'actions', label: '', render: r => (
      <button onClick={() => { setSelected(r); setProofModal(true) }}
        className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs">
        <FiEye size={13} /> View
      </button>
    )},
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Deposits</h1>
          <p className="text-white/40 text-sm mt-1">{meta.total || 0} deposits</p>
        </div>
        <div className="flex gap-2">
          {['pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${status === s ? 'bg-brand-500 text-white' : 'bg-white/8 text-white/50 hover:bg-white/12'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <>
            <Table columns={columns} data={deposits} emptyMessage={`No ${status} deposits`} />
            <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
          </>
        )}
      </div>

      <Modal open={proofModal} onClose={() => !actionLoading && setProofModal(false)} title="Review Deposit">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['User', selected.user?.name], ['Amount', formatCurrency(selected.amount)], ['Date', formatDateTime(selected.created_at)]].map(([k,v]) => (
                <div key={k}><p className="text-white/40 text-xs mb-0.5">{k}</p><p className="text-white font-medium">{v}</p></div>
              ))}
            </div>
            {selected.proof_url && (
              <div>
                <p className="text-white/40 text-xs mb-2">Proof of payment</p>
                <img src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api','')}/storage/${selected.proof_url}`}
                  alt="proof" className="w-full rounded-xl max-h-48 object-contain bg-black/20" />
              </div>
            )}
            {selected.status === 'pending' && (
              <>
                <div>
                  <label className="text-white/60 text-xs block mb-1.5">Admin note (optional)</label>
                  <input value={note} onChange={e => setNote(e.target.value)} className="input-field text-sm" placeholder="Add a note..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => action(selected.id, 'rejected')} disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all text-sm">
                    <FiX size={14} /> Reject
                  </button>
                  <button onClick={() => action(selected.id, 'approved')} disabled={actionLoading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                    {actionLoading ? <Spinner size="sm" /> : <FiCheck size={14} />} Approve
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ─── ADMIN WITHDRAWALS ─── */
export function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => { fetch() }, [page, status])

  const fetch = () => {
    setLoading(true)
    api.get(`/admin/withdrawals?page=${page}&status=${status}`).then(r => {
      setWithdrawals(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setLoading(false))
  }

  const action = async (id, act) => {
    setActionLoading(true)
    try {
      await api.patch(`/admin/withdrawals/${id}`, { status: act, admin_note: note })
      toast.success(`Withdrawal ${act}`)
      setModal(false)
      setNote('')
      fetch()
    } catch { toast.error('Action failed') } finally { setActionLoading(false) }
  }

  const columns = [
    { key: 'user', label: 'User', render: r => <div><p className="text-white text-sm">{r.user?.name}</p><p className="text-white/30 text-xs">{r.user?.email}</p></div> },
    { key: 'amount', label: 'Amount', render: r => <span className="font-mono text-rose-400 font-semibold">{formatCurrency(r.amount, 0)}</span> },
    { key: 'net', label: 'Net (85%)', render: r => <span className="font-mono text-white/60 text-xs">{formatCurrency(r.amount * 0.85, 0)}</span> },
    { key: 'bank', label: 'Bank Details', render: r => <div><p className="text-white/70 text-xs">{r.bank_name}</p><p className="text-white/40 text-xs">{r.account_number} · {r.account_name}</p></div> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: r => (
      <button onClick={() => { setSelected(r); setModal(true) }}
        className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs">
        <FiEye size={13} /> Review
      </button>
    )},
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Withdrawals</h1>
          <p className="text-white/40 text-sm mt-1">{meta.total || 0} withdrawals</p>
        </div>
        <div className="flex gap-2">
          {['pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${status === s ? 'bg-brand-500 text-white' : 'bg-white/8 text-white/50 hover:bg-white/12'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <>
            <Table columns={columns} data={withdrawals} emptyMessage={`No ${status} withdrawals`} />
            <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
          </>
        )}
      </div>

      <Modal open={modal} onClose={() => !actionLoading && setModal(false)} title="Review Withdrawal">
        {selected && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-2.5">
              {[
                ['User', selected.user?.name],
                ['Amount', formatCurrency(selected.amount)],
                ['Net payout (85%)', formatCurrency(selected.amount * 0.85)],
                ['Bank', selected.bank_name],
                ['Account Number', selected.account_number],
                ['Account Name', selected.account_name],
                ['Requested', formatDateTime(selected.created_at)],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40 text-xs">{k}</span>
                  <span className="text-white text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
            {selected.status === 'pending' && (
              <>
                <div>
                  <label className="text-white/60 text-xs block mb-1.5">Admin note (optional)</label>
                  <input value={note} onChange={e => setNote(e.target.value)} className="input-field text-sm" placeholder="Add a note..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => action(selected.id, 'rejected')} disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm transition-all">
                    <FiX size={14} /> Reject
                  </button>
                  <button onClick={() => action(selected.id, 'approved')} disabled={actionLoading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                    {actionLoading ? <Spinner size="sm" /> : <FiCheck size={14} />} Mark Paid
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ─── ADMIN SETTINGS ─── */
export function AdminSettings() {
  const [form, setForm] = useState({ bank_name: '', account_name: '', account_number: '', telegram_link: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get('/settings/bank-details').then(r => {
      if (r.data.data) setForm(r.data.data)
    }).finally(() => setFetching(false))
  }, [])

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/settings', form)
      toast.success('Settings saved!')
    } catch { toast.error('Save failed') } finally { setLoading(false) }
  }

  if (fetching) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Platform Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure bank details and other platform settings</p>
      </div>

      <form onSubmit={save} className="glass-card p-6 space-y-5">
        <h3 className="font-display font-semibold text-white">Bank Account Details</h3>
        <p className="text-white/40 text-sm -mt-3">These details will be shown to users making deposits.</p>
        {[
          { name: 'bank_name', label: 'Bank Name', placeholder: 'e.g. GTBank' },
          { name: 'account_name', label: 'Account Name', placeholder: 'Account holder name' },
          { name: 'account_number', label: 'Account Number', placeholder: '10-digit number' },
          { name: 'telegram_link', label: 'Telegram Group Link', placeholder: 'https://t.me/...' },
        ].map(f => (
          <div key={f.name}>
            <label className="text-white/60 text-sm block mb-1.5">{f.label}</label>
            <input name={f.name} value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
              placeholder={f.placeholder} className="input-field" />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <><Spinner size="sm" />Saving...</> : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

/* ─── ADMIN TRANSACTIONS ─── */
export function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/admin/transactions?page=${page}`).then(r => {
      setTransactions(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setLoading(false))
  }, [page])

  const columns = [
    { key: 'user', label: 'User', render: r => <span className="text-white text-sm">{r.user?.name}</span> },
    { key: 'description', label: 'Description', render: r => <span className="text-white/70 text-sm">{r.description}</span> },
    { key: 'amount', label: 'Amount', render: r => (
      <span className={`font-mono font-semibold ${r.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {r.type === 'credit' ? '+' : '-'}{formatCurrency(r.amount)}
      </span>
    )},
    { key: 'type', label: 'Type', render: r => <span className={r.type === 'credit' ? 'badge-success' : 'badge-danger'}>{r.type}</span> },
    { key: 'date', label: 'Date', render: r => <span className="text-white/40 text-xs">{formatDateTime(r.created_at)}</span> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">All Transactions</h1>
        <p className="text-white/40 text-sm mt-1">{meta.total || 0} total transactions</p>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <>
            <Table columns={columns} data={transactions} emptyMessage="No transactions" />
            <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

/* ─── ADMIN INVESTMENTS ─── */
export function AdminInvestments() {
  const [investments, setInvestments] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/admin/investments?page=${page}`).then(r => {
      setInvestments(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setLoading(false))
  }, [page])

  const columns = [
    { key: 'user', label: 'User', render: r => <span className="text-white text-sm">{r.user?.name}</span> },
    { key: 'plan', label: 'Plan', render: r => <span className="text-brand-400 font-medium text-sm">{r.plan_name}</span> },
    { key: 'cost', label: 'Cost', render: r => <span className="font-mono text-white/80">{formatCurrency(r.amount, 0)}</span> },
    { key: 'daily', label: 'Daily', render: r => <span className="font-mono text-emerald-400">{formatCurrency(r.daily_income, 0)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'started', label: 'Started', render: r => <span className="text-white/40 text-xs">{formatDateTime(r.created_at)}</span> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Investments</h1>
        <p className="text-white/40 text-sm mt-1">{meta.total || 0} total investments</p>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <>
            <Table columns={columns} data={investments} emptyMessage="No investments" />
            <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
