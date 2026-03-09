import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

export default function Profile() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    brandName: user?.brandName || "",
    industry: user?.industry || "",
    defaultTone: user?.defaultTone || "professional",
    website: user?.website || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put("/profile", form);
      login(data.user, localStorage.getItem("token"));
      toast.success("Profile updated! ✅");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", paddingTop: 80, paddingBottom: 60 }}>

      <div className="mesh-bg" />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "Syne", fontWeight: 800 }}>
            Your <span className="shimmer-text">Profile</span>
          </h1>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(124,58,237,0.1)", borderRadius: 12, padding: 4, marginBottom: 28, width: "fit-content" }}>
          {["profile", "brand"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === t ? "linear-gradient(135deg, #7c3aed, #e879f9)" : "transparent",
                color: tab === t ? "white" : "#6b6b8a",
                fontFamily: "Syne", fontWeight: 700, fontSize: 14, transition: "all 0.3s",
                textTransform: "capitalize",
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
          {tab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Full Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Bio</label>
                <textarea className="input-field" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." style={{ resize: "none" }} />
              </div>
              <div>
                <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Email</label>
                <input className="input-field" value={user?.email || ""} disabled style={{ opacity: 0.5 }} />
              </div>
            </div>
          )}

          {tab === "brand" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

          <motion.button className="btn-primary" onClick={handleSave} disabled={saving}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ marginTop: 28, padding: "14px 32px" }}>
            {saving ? "Saving..." : "Save Changes ✓"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}