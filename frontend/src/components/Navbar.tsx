"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { getCurrentUser, signout } from "@/lib/auth"

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Prediction", to: "/dashboard" },
  { label: "Models", to: "/models" },
  { label: "About", to: "/about" },
]

export function Navbar() {
  const pathname = useLocation().pathname
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setUser(getCurrentUser())
  }, [pathname])

  const handleSignOut = () => {
    signout()
    setUser(null)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/images/logo/logo.png" alt="Digilians Perfect Heros" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-sm lg:text-base tracking-tight">
              Digilians Perfect Heros
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  )}
                </Link>
              )
            })}
            <Link
              to="/dashboard"
              className="ml-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              Start Prediction
            </Link>
            {user ? (
              <div className="ml-3 flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-semibold text-muted border border-border rounded-xl hover:bg-gray-50 hover:text-red-500 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="ml-3 px-5 py-2.5 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl"
              >
                Start Prediction
              </Link>
              {user ? (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <p className="px-4 py-2 text-sm font-medium text-foreground">Signed in as {user.name}</p>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false) }}
                    className="block w-full px-4 py-3 text-center text-sm font-semibold text-red-500 border border-border rounded-xl hover:bg-red-50 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-semibold text-foreground border border-border rounded-xl"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
