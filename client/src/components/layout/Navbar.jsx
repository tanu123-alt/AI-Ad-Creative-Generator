import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onFeedback }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const links = [
    { path: "/studio", label: "Studio", icon: "✦" },
    { path: "/history", label: "History", icon: "◈" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(6,6,14,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(124,58,237,0.2)", height: 68 }}>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <motion.button onClick={() => navigate("/")} whileHover={{ scale: 1.03 }}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", fontFamily: "Syne" }}>A</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "#f0e6ff" }}>
              AdVantage <span style={{ color: "#e879f9" }}>Gen</span>
            </span>
          </motion.button>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {links.map((link) => {
              const active = location.pathname === link.path;
              return (
                <motion.button key={link.path} onClick={() => navigate(link.path)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  style={{ background: active ? "rgba(124,58,237,0.2)" : "transparent", border: `1px solid ${active ? "rgba(124,58,237,0.5)" : "transparent"}`, color: active ? "#e879f9" : "#6b6b8a", padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7, transition: "all 0.3s" }}>
                  <span>{link.icon}</span>{link.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right: Feedback + Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.button onClick={onFeedback} whileHover={{ scale: 1.05 }}
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>
              💬 Feedback
            </motion.button>

            {/* Profile avatar + dropdown */}
            <div style={{ position: "relative" }}>
              <motion.button
                onClick={() => setProfileOpen(!profileOpen)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #e879f9)", border: "2px solid rgba(124,58,237,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "white", fontFamily: "Syne" }}>
                {user?.name?.charAt(0).toUpperCase() || "G"}
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    {/* Backdrop */}
                    <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      style={{ position: "absolute", top: 54, right: 0, width: 230, background: "rgba(10,10,20,0.98)", backdropFilter: "blur(20px)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 16, padding: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", zIndex: 200 }}>

                      {/* User info */}
                      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(124,58,237,0.15)", marginBottom: 6 }}>
                        <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#f0e6ff" }}>{user?.name || "Guest User"}</div>
                        <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 3 }}>{user?.email || "guest@advantagegen.ai"}</div>
                      </div>

                      {[
                        { icon: "👤", label: "My Profile", path: "/profile" },
                        { icon: "◈", label: "History", path: "/history" },
                        { icon: "⚙️", label: "Settings", path: "/profile?tab=settings" },
                      ].map((item) => (
                        <button key={item.label}
                          onClick={() => { navigate(item.path); setProfileOpen(false); }}
                          style={{ width: "100%", background: "transparent", border: "none", color: "#a78bfa", padding: "11px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.15)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <span>{item.icon}</span>{item.label}
                        </button>
                      ))}

                      <div style={{ borderTop: "1px solid rgba(124,58,237,0.15)", marginTop: 6, paddingTop: 6 }}>
                        <button onClick={handleLogout}
                          style={{ width: "100%", background: "transparent", border: "none", color: "#ef4444", padding: "11px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          🚪 Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", width: 38, height: 38, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "none", alignItems: "center", justifyContent: "center" }}
              className="navbar-mobile-show">
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "fixed", top: 68, right: 0, bottom: 0, width: 260, zIndex: 99, background: "rgba(10,10,20,0.98)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(124,58,237,0.2)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {links.map((link) => (
              <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }}
                style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.2)", color: "#f0e6ff", padding: "14px 18px", borderRadius: 12, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                <span>{link.icon}</span>{link.label}
              </button>
            ))}
            <button onClick={() => { navigate("/profile"); setMobileOpen(false); }}
              style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.2)", color: "#f0e6ff", padding: "14px 18px", borderRadius: 12, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
              👤 Profile
            </button>
            <button onClick={handleLogout}
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "14px 18px", borderRadius: 12, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
              🚪 Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}