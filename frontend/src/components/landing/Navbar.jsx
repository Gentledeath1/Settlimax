import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import Logo from '../shared/Logo'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false) 
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Plans', href: '#plans' },
    { label: 'How It Works', href: '#how' },
    { label: 'Referrals', href: '#referral' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-dark-800/90 backdrop-blur-md border-b border-white/10' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo size="md" />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              className="text-white/60 hover:text-white transition-colors text-sm font-body font-medium">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="btn-primary py-2 text-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary py-2 text-sm">Login</Link>
              <Link to="/register" className="btn-primary py-2 text-sm">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white/70 hover:text-white p-1" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)}
              className="block py-3 text-white/60 hover:text-white transition-colors font-body text-sm border-b border-white/5">
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-3">
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary flex-1 text-center text-sm py-2.5">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2.5">Login</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2.5">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
