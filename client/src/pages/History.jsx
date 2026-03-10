import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAds, deleteAd } from "../utils/api";

const PLATFORMS = ["all", "Instagram", "LinkedIn", "Facebook", "Twitter"];
const TONES = ["all", "witty", "professional", "urgent", "inspirational"];
const toneColors = { witty: "#f59e0b", professional: "#06b6d4", urgent: "#ef4444", inspirational: "#10b981" };

export default function History() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ tone: "all", platform: "all", search: "" });

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = async () => {
    try {
      const { data } = await getAds();
      setAds(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load campaigns — is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAd(id);
      setAds((prev) => prev.filter((a) => a._id !== id));
      toast.success("Deleted ✓");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleRemix = (ad) => {
    sessionStorage.setItem("remix_campaign", JSON.stringify({
      product: ad.product, audience: ad.audience, tone: ad.tone, platform: ad.platform,
    }));
    navigate("/studio");
  };

  const filtered = ads.filter((ad) => {
    if (filters.tone !== "all" && ad.tone !== filters.tone) return false;
    if (filters.platform !== "all" && ad.platform !== filters.platform) return false;
    if (filters.search && !ad.product?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", paddingTop: 88, paddingBottom: 60 }}>

      <div className="mesh-bg" />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontFamily: "Syne", fontWeight: 800, color: "#f0e6ff" }}>
            Campaign <span className="shimmer-text">History</span>
          </h1>
          <p style={{ color: "#6b6b8a", marginTop: 8, fontSize: 16 }}>{ads.length} campaigns saved</p>
        </motion.div>

        {/* Filters */}
        <div className="glass" style={{ borderRadius: 14, padding: "18px 24px", marginBottom: 28, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <input className="input-field" placeholder="🔍 Search by product..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })} style={{ maxWidth: 260 }} />
          <select className="input-field" value={filters.tone} onChange={(e) => setFilters({ ...filters, tone: e.target.value })} style={{ maxWidth: 160 }}>
            {TONES.map((t) => <option key={t} value={t}>{t === "all" ? "All Tones" : t}</option>)}
          </select>
          <select className="input-field" value={filters.platform} onChange={(e) => setFilters({ ...filters, platform: e.target.value })} style={{ maxWidth: 160 }}>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p === "all" ? "All Platforms" : p}</option>)}
          </select>
          {(filters.search || filters.tone !== "all" || filters.platform !== "all") && (
            <button onClick={() => setFilters({ tone: "all", platform: "all", search: "" })}
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 13 }}>
              ✕ Clear
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6b6b8a" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 44, height: 44, border: "3px solid rgba(124,58,237,0.3)", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto 18px" }} />
            <p style={{ fontFamily: "Syne", fontWeight: 600 }}>Loading campaigns...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6b6b8a" }}>
            <div style={{ fontSize: 52, marginBottom: 18 }}>📭</div>
            <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, color: "#f0e6ff", marginBottom: 8 }}>No campaigns found</p>
            <p style={{ fontSize: 15, marginBottom: 24 }}>Generate your first ad to see it here</p>
            <button className="btn-primary" onClick={() => navigate("/studio")} style={{ padding: "14px 28px" }}>
              Create your first ad →
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
            {filtered.map((ad, i) => (
              <motion.div key={ad._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass"
                style={{ borderRadius: 18, overflow: "hidden", cursor: "default" }}
                whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(124,58,237,0.25)" }}>

                {/* Image */}
                <div style={{ aspectRatio: "1", background: "rgba(124,58,237,0.08)", position: "relative", overflow: "hidden" }}>
                  {ad.image ? (
                    <img
                      src={`/generated/${ad.image}`}
                      alt={ad.product}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🎨</div>
                  )}
                  {/* Hover overlay */}
                  <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                    style={{ position: "absolute", inset: 0, background: "rgba(6,6,14,0.88)", display: "flex", gap: 12, alignItems: "center", justifyContent: "center" }}>
                    <button className="btn-primary" onClick={() => handleRemix(ad)} style={{ padding: "11px 20px", fontSize: 13 }}>🔄 Remix</button>
                    <button onClick={() => handleDelete(ad._id)}
                      style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", padding: "11px 20px", borderRadius: 10, cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 13 }}>
                      🗑 Delete
                    </button>
                  </motion.div>
                </div>

                {/* Info */}
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ background: `${toneColors[ad.tone] || "#7c3aed"}22`, color: toneColors[ad.tone] || "#a78bfa", padding: "3px 11px", borderRadius: 100, fontSize: 11, fontFamily: "Syne", fontWeight: 700 }}>{ad.tone || "general"}</span>
                    <span style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "3px 11px", borderRadius: 100, fontSize: 11, fontFamily: "Syne", fontWeight: 700 }}>{ad.platform}</span>
                  </div>
                  <p style={{ color: "#f0e6ff", fontSize: 15, fontFamily: "Syne", fontWeight: 700, marginBottom: 4 }}>{ad.product}</p>
                  <p style={{ color: "#6b6b8a", fontSize: 13, marginBottom: 6 }}>{ad.audience}</p>
                  <p style={{ color: "#4b4b6a", fontSize: 11 }}>{new Date(ad.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}