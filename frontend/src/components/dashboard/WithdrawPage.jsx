import React, { useState, useEffect } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDateTime, MIN_WITHDRAWAL, WITHDRAWAL_CHARGE } from '../../utils/helpers'
import { StatusBadge, Spinner, Table, Pagination, Modal } from '../shared/UI'

export default function WithdrawPage() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({ amount: '', bank_name: '', account_name: '', account_number: '' })
  const [withdrawals, setWithdrawals] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { fetchWithdrawals() }, [page])

  const fetchWithdrawals = () => {
    api.get(`/withdrawals?page=${page}`).then(r => {
      setWithdrawals(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    })
  }

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const charge = form.amount ? (parseFloat(form.amount) * WITHDRAWAL_CHARGE / 100) : 0
  const net = form.amount ? (parseFloat(form.amount) - charge) : 0

  const submit = async () => {
    setLoading(true)
    try {
      await api.post('/withdrawals', form)
      toast.success('Withdrawal request submitted!')
      setConfirmOpen(false)
      setForm({ amount: '', bank_name: '', account_name: '', account_number: '' })
      await refreshUser()
      fetchWithdrawals()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const validate = e => {
    e.preventDefault()
    const amt = parseFloat(form.amount)
    if (amt < MIN_WITHDRAWAL) { toast.error(`Minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL, 0)}`); return }
    if (amt > (user?.wallet_balance || 0)) { toast.error('Insufficient wallet balance'); return }
    if (!form.bank_name || !form.account_name || !form.account_number) { toast.error('Please fill in all bank details'); return }
    setConfirmOpen(true)
  }

  const columns = [
    { key: 'amount', label: 'Amount', render: r => <span className="font-mono text-white">{formatCurrency(r.amount)}</span> },
    { key: 'net', label: `Net (after ${WITHDRAWAL_CHARGE}%)`, render: r => <span className="font-mono text-emerald-400">{formatCurrency(r.amount * (1 - WITHDRAWAL_CHARGE / 100))}</span> },
    { key: 'bank', label: 'Bank', render: r => <span className="text-white/60 text-xs">{r.bank_name}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_at', label: 'Date', render: r => <span className="text-white/50 text-xs">{formatDateTime(r.created_at)}</span> },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Withdraw</h1>
        <p className="text-white/40 text-sm mt-1">Balance: <span className="text-white font-medium">{formatCurrency(user?.wallet_balance || 0)}</span></p>
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Min Withdrawal', value: formatCurrency(MIN_WITHDRAWAL, 0) },
          { label: 'Processing Charge', value: `${WITHDRAWAL_CHARGE}%` },
          { label: 'Processing Time', value: 'Within 24hrs' },
        ].map(item => (
          <div key={item.label} className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">{item.label}</p>
            <p className="font-display font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={validate} className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold text-white mb-2">Request Withdrawal</h2>

          <div>
            <label className="text-white/60 text-sm block mb-1.5">Amount (₦)</label>
            <input name="amount" type="number" min={MIN_WITHDRAWAL} step="1"
              value={form.amount} onChange={handle} required
              placeholder={`Min ${formatCurrency(MIN_WITHDRAWAL, 0)}`} className="input-field" />
            {form.amount && (
              <p className="text-white/30 text-xs mt-1">You receive: <span className="text-emerald-400 font-semibold">{formatCurrency(net)}</span> after {WITHDRAWAL_CHARGE}% charge</p>
            )}
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-1.5">Bank name</label>
            <input name="bank_name" value={form.bank_name} onChange={handle} required
              placeholder="e.g. GTBank" className="input-field" />
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-1.5">Account name</label>
            <input name="account_name" value={form.account_name} onChange={handle} required
              placeholder="Account holder name" className="input-field" />
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-1.5">Account number</label>
            <input name="account_number" value={form.account_number} onChange={handle} required
              placeholder="10-digit account number" maxLength={10} className="input-field" />
          </div>

          <button type="submit" className="btn-primary w-full py-3.5">Continue to Withdraw</button>
        </form>

        <div className="space-y-4">
          <div className="glass-card p-5 border-amber-500/20 bg-amber-500/5">
            <div className="flex gap-3">
              <FiAlertCircle className="text-amber-400 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-amber-300 font-semibold text-sm mb-1">Important Notes</p>
                <ul className="text-amber-200/60 text-xs space-y-1.5">
                  <li>• A {WITHDRAWAL_CHARGE}% processing charge is deducted from all withdrawals</li>
                  <li>• Ensure your bank details are correct before submitting</li>
                  <li>• Withdrawals are processed manually within 24 hours</li>
                  <li>• Minimum withdrawal amount is {formatCurrency(MIN_WITHDRAWAL, 0)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display font-semibold text-white mb-4">Withdrawal History</h2>
        <div className="glass-card overflow-hidden">
          <Table columns={columns} data={withdrawals} emptyMessage="No withdrawals yet" />
          <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
        </div>
      </div>

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => !loading && setConfirmOpen(false)} title="Confirm Withdrawal">
        <div className="space-y-4">
          <div className="glass-card p-4 space-y-2">
            {[
              ['Amount', formatCurrency(parseFloat(form.amount || 0))],
              [`Charge (${WITHDRAWAL_CHARGE}%)`, `- ${formatCurrency(charge)}`],
              ['You receive', formatCurrency(net)], 
              ['Bank', form.bank_name],
              ['Account', form.account_number],
              ['Name', form.account_name],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-white/40 text-sm">{k}</span>
                <span className="text-white font-mono text-sm">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setConfirmOpen(false)} disabled={loading} className="btn-secondary flex-1">Cancel</button>
            <button onClick={submit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" />Processing...</> : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
