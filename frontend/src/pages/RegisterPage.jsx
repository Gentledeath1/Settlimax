import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiGift } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/shared/Logo'
import { Spinner } from '../components/shared/UI'
import { WELCOME_BONUS, formatCurrency } from '../utils/helpers'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
    referral_code: params.get('ref') || ''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success(`Account created! ${formatCurrency(WELCOME_BONUS, 0)} welcome bonus added.`)
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach(msg => toast.error(msg))
      } else {
        toast.error(err.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><Logo size="md" className="justify-center mb-6" /></Link>
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-white/40 text-sm mt-1">Start earning with StackEarnx today</p>
        </div>

        {/* Welcome bonus banner */}
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-6">
          <FiGift className="text-emerald-400 shrink-0" size={18} />
          <p className="text-emerald-300 text-sm">
            Get <span className="font-bold">{formatCurrency(WELCOME_BONUS, 0)}</span> welcome bonus on signup + ₦50 daily login bonus
          </p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm font-body block mb-1.5">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input name="name" type="text" value={form.name} onChange={handle} required
                  placeholder="Your full name" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm font-body block mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input name="email" type="email" value={form.email} onChange={handle} required
                  placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm font-body block mb-1.5">Phone number</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input name="phone" type="tel" value={form.phone} onChange={handle} required
                  placeholder="08012345678" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm font-body block mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} required
                  placeholder="Min. 8 characters" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm font-body block mb-1.5">Confirm password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input name="password_confirmation" type={showPass ? 'text' : 'password'} value={form.password_confirmation} onChange={handle} required
                  placeholder="Repeat password" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm font-body block mb-1.5">Referral code <span className="text-white/25">(optional)</span></label>
              <input name="referral_code" type="text" value={form.referral_code} onChange={handle}
                placeholder="Enter referral code" className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading ? <><Spinner size="sm" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
