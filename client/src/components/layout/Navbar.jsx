
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onFeedback }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { path: "/studio", label: "Studio", icon: "✦" },
    { path: "/history", label: "History", icon: "◈" },
  ];

  return (
    <>
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(6,6,14,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(124,58,237,0.2)", height: 68 }}>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <motion.button onClick={() => navigate("/")} whileHover={{ scale: 1.03 }}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white" }}>A</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "#f0e6ff" }}>AdVantage <span style={{ color: "#e879f9" }}>Gen</span></span>
          </motion.button>

          {/* Desktop links */}
          <div className="navbar-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {links.map((link) => {
              const active = location.pathname === link.path;
              return (
                <motion.button key={link.path} onClick={() => navigate(link.path)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  style={{ background: active ? "rgba(124,58,237,0.2)" : "transparent", border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "transparent"}`, color: active ? "#e879f9" : "#6b6b8a", padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7, transition: "all 0.3s" }}>
                  <span style={{ fontSize: 18 }}>{link.icon}</span>{link.label}
                </motion.button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.button onClick={onFeedback} className="navbar-links" whileHover={{ scale: 1.05 }}
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>
              💬 Feedback
            </motion.button>

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="navbar-mobile-show"
              style={{ background: "none", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", width: 38, height: 38, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "none", alignItems: "center", justifyContent: "center" }}>
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "fixed", top: 68, right: 0, bottom: 0, width: 240, zIndex: 99, background: "rgba(10,10,20,0.98)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(124,58,237,0.2)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {links.map((link) => (
              <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }}
                style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.2)", color: "#f0e6ff", padding: "14px 18px", borderRadius: 12, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                <span>{link.icon}</span>{link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}