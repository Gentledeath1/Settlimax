import React, { useState } from 'react'
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom'
import {
  FiHome, FiTrendingUp, FiArrowDownCircle, FiArrowUpCircle,
  FiUsers, FiList, FiSettings, FiLogOut, FiMenu, FiX, FiBell
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Logo from '../shared/Logo'
import { formatCurrency } from '../../utils/helpers'

const navItems = [
  { to: '/dashboard',             icon: FiHome,           label: 'Overview' },
  { to: '/dashboard/invest',      icon: FiTrendingUp,     label: 'Invest' },
  { to: '/dashboard/deposit',     icon: FiArrowDownCircle,label: 'Deposit' },
  { to: '/dashboard/withdraw',    icon: FiArrowUpCircle,  label: 'Withdraw' },
  { to: '/dashboard/referrals',   icon: FiUsers,          label: 'Referrals' },
  { to: '/dashboard/history',     icon: FiList,           label: 'Transactions' },
  { to: '/dashboard/profile',     icon: FiSettings,       label: 'Profile' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/8">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/8">
        <div className="glass-card p-3 mb-3">
          <p className="text-white/40 text-xs mb-0.5">Available balance</p>
          <p className="font-display font-bold text-white text-lg">
            {formatCurrency(user?.wallet_balance || 0)}
          </p>
        </div>
        <button onClick={handleLogout}
          className="sidebar-link w-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10">
          <FiLogOut size={18} /> <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-white/8 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-dark-800 border-r border-white/8 h-full">
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1">
              <FiX size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-dark-900/95 backdrop-blur border-b border-white/8 px-4 sm:px-6 h-16 flex items-center justify-between">
          <button className="lg:hidden text-white/60 hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-white/40 text-sm font-body">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
              <span className="text-white font-medium ml-1">{user?.name?.split(' ')[0]}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-white/40 text-xs">Balance</p>
              <p className="text-white font-display font-semibold text-sm">{formatCurrency(user?.wallet_balance || 0)}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-display font-bold text-brand-400 text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
