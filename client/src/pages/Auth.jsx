Auth.jsx -
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
  setLoading(true);

  try {
    const fakeUser = {
      name: form.name || "User",
      email: form.email
    };

    login(fakeUser, "fake-token");

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
      initial={{ opacity: 0, x: 100, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", display: "flex" }}>

      <div className="mesh-bg" />

      {/* Left panel */}
      <div className="auth-left-panel" style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", padding: 60, position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: 400 }}>
          <h1 style={{ fontSize: 48, fontFamily: "Syne", fontWeight: 800, marginBottom: 20 }}>
            Create Ads that <span className="shimmer-text">Convert</span>
          </h1>
          <p style={{ color: "#6b6b8a", fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
            Generate stunning ad creatives with AI in seconds. Images, copy, and hashtags — all in one place.
          </p>
          {["AI Image Generation", "Smart Copywriting", "Multi-Platform Support", "Campaign History"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
              <span style={{ color: "#f4c2c2", fontFamily: "Syne", fontWeight: 800 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 60, position: "relative", zIndex: 1,
      }}>
        <motion.div className="glass" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%", maxWidth: 520, borderRadius: 24, padding: 60 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 88, height: 88, borderRadius: 18, background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, margin: "0 auto 12px" }}>A</div>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22 }}>AdVantage Gen</h2>
          </div>

          {/* Tab switcher */}
          <div className="tab-switcher" style={{ display: "flex", background: "rgba(124,58,237,0.1)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
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
                <input className="input-field" type="email" placeholder="Email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input-field" type="password" placeholder="Password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button className="btn-primary" onClick={handleSubmit} disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ width: "100%", marginTop: 24, padding: "15px 0", fontSize: 16 }}>
            {loading ? "Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}