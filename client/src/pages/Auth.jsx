import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async () => {
    if (!form.email) return toast.error("Enter your email");
    if (!form.password) return toast.error("Enter your password");
    if (tab === "register" && !form.name) return toast.error("Enter your name");

    setLoading(true);
    try {
      const userData = {
        name: form.name || form.email.split("@")[0],
        email: form.email,
      };
      login(userData);
      toast.success(tab === "login" ? "Welcome back! 👋" : "Account created! 🎉");
      navigate("/studio");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", display: "flex" }}>

      <div className="mesh-bg" />

      {/* Left panel */}
      <div className="auth-left-panel" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 60, position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 48, fontFamily: "Syne", fontWeight: 800, marginBottom: 20, color: "#f0e6ff" }}>
            Create Ads that <span className="shimmer-text">Convert</span>
          </h1>
          <p style={{ color: "#6b6b8a", fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
            Generate stunning ad creatives with AI in seconds. Images, copy, and hashtags — all in one place.
          </p>
          {["AI Image Generation", "Smart Copywriting", "Multi-Platform Support", "Campaign History"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>✓</div>
              <span style={{ color: "#f4c2c2", fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", zIndex: 1 }}>
        <motion.div className="glass" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%", maxWidth: 480, borderRadius: 24, padding: 52 }}>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, margin: "0 auto 14px", color: "white", fontFamily: "Syne" }}>A</div>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: "#f0e6ff" }}>AdVantage Gen</h2>
            <p style={{ color: "#6b6b8a", fontSize: 14, marginTop: 6 }}>
              {tab === "login" ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "rgba(124,58,237,0.1)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer",
                  background: tab === t ? "linear-gradient(135deg, #7c3aed, #e879f9)" : "transparent",
                  color: tab === t ? "white" : "#6b6b8a",
                  fontFamily: "Syne", fontWeight: 700, fontSize: 14, transition: "all 0.3s",
                }}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {tab === "register" && (
                  <input className="input-field" placeholder="Full Name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                )}
                <input className="input-field" type="email" placeholder="Email address"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input-field" type="password" placeholder="Password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button className="btn-primary" onClick={handleSubmit} disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ width: "100%", marginTop: 24, padding: "16px 0", fontSize: 16 }}>
            {loading ? "Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
          </motion.button>

          <p style={{ textAlign: "center", marginTop: 20, color: "#6b6b8a", fontSize: 13 }}>
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setTab(tab === "login" ? "register" : "login")}
              style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 13 }}>
              {tab === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}