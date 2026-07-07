import { Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Home from "@/pages/Home"
import Dashboard from "@/pages/Dashboard"
import Explanation from "@/pages/Explanation"
import Models from "@/pages/Models"
import About from "@/pages/About"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explanation" element={<Explanation />} />
          <Route path="/models" element={<Models />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
