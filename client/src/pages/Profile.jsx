import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    brandName: user?.brandName || "",
    industry: user?.industry || "",
    defaultTone: user?.defaultTone || "professional",
    website: user?.website || "",
    notifications: user?.notifications ?? true,
  });

  // ✅ Auto-open Settings tab if navigated from navbar Settings link
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "profile";
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    if (t) setTab(t);
  }, [location.search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      login({ ...user, ...form });
      toast.success("Profile updated! ✅");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { key: "profile", label: "👤 Profile" },
    { key: "brand", label: "🏷️ Brand" },
    { key: "settings", label: "⚙️ Settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", paddingTop: 88, paddingBottom: 60 }}>

      <div className="mesh-bg" />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #e879f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, color: "white", fontFamily: "Syne", border: "3px solid rgba(124,58,237,0.4)", flexShrink: 0 }}>
            {(form.name || user?.name || "G").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontFamily: "Syne", fontWeight: 800, margin: 0, color: "#f0e6ff" }}>
              Your <span className="shimmer-text">Profile</span>
            </h1>
            <p style={{ color: "#6b6b8a", marginTop: 5, fontSize: 15 }}>{form.email || user?.email}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          {[{ label: "Ads Generated", value: "∞" }, { label: "Platforms", value: "4" }, { label: "Tones", value: "4" }].map((stat) => (
            <div key={stat.label} className="glass" style={{ flex: 1, borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 26, color: "#e879f9" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 5 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(124,58,237,0.1)", borderRadius: 12, padding: 4, marginBottom: 28, width: "fit-content" }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: "11px 22px", borderRadius: 10, border: "none", cursor: "pointer", background: tab === t.key ? "linear-gradient(135deg, #7c3aed, #e879f9)" : "transparent", color: tab === t.key ? "white" : "#6b6b8a", fontFamily: "Syne", fontWeight: 700, fontSize: 14, transition: "all 0.3s" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Full Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Email</label>
                <input className="input-field" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Bio</label>
                <textarea className="input-field" rows={4} value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..." style={{ resize: "none" }} />
              </div>
            </div>
          )}

          {/* BRAND TAB */}
          {tab === "brand" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Brand Name</label>
                <input className="input-field" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder="Your company name" />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Industry</label>
                <input className="input-field" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. E-commerce, SaaS, Fashion" />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Website</label>
                <input className="input-field" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yoursite.com" />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Default Tone</label>
                <select className="input-field" value={form.defaultTone} onChange={(e) => setForm({ ...form, defaultTone: e.target.value })}>
                  {["witty", "professional", "urgent", "inspirational"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17, color: "#f0e6ff", margin: "0 0 8px" }}>Preferences</h3>

              {/* Notification toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: "rgba(124,58,237,0.08)", borderRadius: 14, border: "1px solid rgba(124,58,237,0.15)" }}>
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#f0e6ff" }}>Email Notifications</div>
                  <div style={{ fontSize: 13, color: "#6b6b8a", marginTop: 3 }}>Receive updates about your campaigns</div>
                </div>
                <div
                  onClick={() => setForm({ ...form, notifications: !form.notifications })}
                  style={{ width: 50, height: 28, borderRadius: 14, background: form.notifications ? "#7c3aed" : "rgba(124,58,237,0.2)", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: form.notifications ? 25 : 3, transition: "left 0.3s" }} />
                </div>
              </div>

              {/* Dark mode toggle (always on) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: "rgba(124,58,237,0.08)", borderRadius: 14, border: "1px solid rgba(124,58,237,0.15)" }}>
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#f0e6ff" }}>Dark Mode</div>
                  <div style={{ fontSize: 13, color: "#6b6b8a", marginTop: 3 }}>Always on for best experience</div>
                </div>
                <div style={{ width: 50, height: 28, borderRadius: 14, background: "#7c3aed", cursor: "not-allowed", position: "relative", opacity: 0.7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: 25 }} />
                </div>
              </div>

              {/* App info */}
              <div style={{ padding: "20px", background: "rgba(124,58,237,0.06)", borderRadius: 14, border: "1px solid rgba(124,58,237,0.12)", marginTop: 8 }}>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#a78bfa", marginBottom: 12 }}>App Info</div>
                {[
                  ["Version", "1.0.0"],
                  ["AI Model", "Groq llama-3.1-8b"],
                  ["Image Model", "Stable Diffusion XL"],
                  ["Database", "MongoDB Atlas"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#6b6b8a", fontSize: 14 }}>{k}</span>
                    <span style={{ color: "#f0e6ff", fontSize: 14, fontFamily: "Syne", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div style={{ padding: "20px", background: "rgba(239,68,68,0.05)", borderRadius: 14, border: "1px solid rgba(239,68,68,0.2)", marginTop: 4 }}>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#ef4444", marginBottom: 6 }}>Danger Zone</div>
                <div style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 16 }}>Clear all session data and sign out of AdVantage Gen</div>
                <button
                  onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "11px 22px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>
                  🚪 Clear Session & Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Save button — not shown on settings tab */}
          {tab !== "settings" && (
            <motion.button className="btn-primary" onClick={handleSave} disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ marginTop: 28, padding: "15px 36px", fontSize: 16 }}>
              {saving ? "Saving..." : "Save Changes ✓"}
            </motion.button>
          )}

          {tab === "settings" && (
            <motion.button className="btn-primary" onClick={handleSave} disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ marginTop: 20, padding: "15px 36px", fontSize: 16 }}>
              {saving ? "Saving..." : "Save Preferences ✓"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}