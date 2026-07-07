import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { signin } from "@/lib/auth"

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = signin(email, password)
    setMessage(result.message)
    setSuccess(result.ok)
    if (result.ok) {
      setTimeout(() => navigate("/"), 1500)
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <GlassCard className="p-8 lg:p-10">
            <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
            <p className="text-sm text-muted text-center mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {message && (
                <p className={`text-sm text-center ${success ? "text-green-600" : "text-red-500"}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                Sign In
              </button>
            </form>

            <p className="text-sm text-muted text-center mt-6">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
