import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import CanvasEditor from "../components/editor/CanvasEditor";
import { generateAd } from "../utils/api";

const TONES = ["witty", "professional", "urgent", "inspirational"];
const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "Twitter"];
const ASPECTS = [
  { label: "1:1 Square", value: "square" },
  { label: "4:5 Vertical", value: "vertical" },
  { label: "16:9 Horizontal", value: "horizontal" },
];
const toneEmojis = { witty: "😄", professional: "💼", urgent: "🔥", inspirational: "✨" };

export default function Studio() {
  const editorRef = useRef(null);
  const [step, setStep] = useState("input");
  const [form, setForm] = useState({ product: "", audience: "", tone: "professional", platform: "Instagram", aspect: "square" });
  const [result, setResult] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const remixData = sessionStorage.getItem("remix_campaign");
    if (remixData) {
      try {
        const parsed = JSON.parse(remixData);
        setForm((prev) => ({ ...prev, ...parsed }));
        sessionStorage.removeItem("remix_campaign");
        toast("Remix loaded! Modify and regenerate 🎨", { duration: 4000 });
      } catch {}
    }
  }, []);

  const handleGenerate = async () => {
    if (!form.product.trim()) return toast.error("Enter a product name");
    if (!form.audience.trim()) return toast.error("Enter a target audience");
    setStep("generating");
    setProgress(0);

    const prog = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 12, 88)), 700);

    try {
      let requestData;
      if (logoFile) {
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        formData.append("logo", logoFile);
        requestData = formData;
      } else {
        requestData = { ...form };
      }

      const { data } = await generateAd(requestData);
      clearInterval(prog);
      setProgress(100);

      // Use imageUrl returned by the API (relative URL, proxied by Vite in dev)
      const imageUrl = data.imageUrl || `/generated/${data.image}`;

      setTimeout(() => {
        setResult({ ...data, imageUrl });
        setStep("result");
      }, 600);
    } catch (err) {
      clearInterval(prog);
      setStep("input");
      const msg = err?.response?.data?.error || err?.message || "Generation failed";
      toast.error(msg, { duration: err?.response?.status === 429 ? 6000 : 3000 });
    }
  };

  const handleExport = () => {
    const data = editorRef.current?.exportPNG();
    if (!data) return toast.error("Nothing to export yet");
    const a = document.createElement("a");
    a.href = data;
    a.download = `advantagegen-${Date.now()}.png`;
    a.click();
    toast.success("Downloaded! ✓");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", paddingTop: 88, paddingBottom: 60 }}>

      <div className="mesh-bg" />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: -1, color: "#f0e6ff" }}>
            AI Creative <span className="shimmer-text">Studio</span>
          </h1>
          <p style={{ color: "#6b6b8a", marginTop: 10, fontSize: 17 }}>Describe your product and let AI do the rest ✦</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div>
            <AnimatePresence mode="wait">

              {step === "input" && (
                <motion.div key="input" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

                  <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 18 }}>
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Product</label>
                    <input className="input-field" placeholder='e.g. "Eco Coffee Cup"' value={form.product}
                      onChange={(e) => setForm({ ...form, product: e.target.value })}
                      style={{ marginBottom: 18, fontSize: 15, padding: "14px 16px" }} />
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Target Audience</label>
                    <input className="input-field" placeholder='e.g. "Young eco-conscious professionals"' value={form.audience}
                      onChange={(e) => setForm({ ...form, audience: e.target.value })}
                      style={{ fontSize: 15, padding: "14px 16px" }} />
                  </div>

                  <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 18 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                      <div>
                        <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Platform</label>
                        <select className="input-field" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} style={{ fontSize: 15, padding: "14px 16px" }}>
                          {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Aspect Ratio</label>
                        <select className="input-field" value={form.aspect} onChange={(e) => setForm({ ...form, aspect: e.target.value })} style={{ fontSize: 15, padding: "14px 16px" }}>
                          {ASPECTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 18 }}>
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Brand Tone</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                      {TONES.map((t) => (
                        <button key={t} onClick={() => setForm({ ...form, tone: t })}
                          style={{ padding: "16px 8px", borderRadius: 12, border: `2px solid ${form.tone === t ? "#7c3aed" : "rgba(124,58,237,0.2)"}`, background: form.tone === t ? "rgba(124,58,237,0.2)" : "transparent", color: form.tone === t ? "#e879f9" : "#6b6b8a", cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: 13, textTransform: "capitalize", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.3s" }}>
                          <span style={{ fontSize: 22 }}>{toneEmojis[t]}</span>{t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass" style={{ borderRadius: 18, padding: 22, marginBottom: 18 }}>
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Logo (optional)</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "2px dashed rgba(124,58,237,0.4)", borderRadius: 12, padding: "16px 20px" }}>
                      <span style={{ fontSize: 26 }}>🖼</span>
                      <span style={{ color: logoFile ? "#a78bfa" : "#6b6b8a", fontSize: 15 }}>
                        {logoFile ? logoFile.name : "Upload PNG/JPG logo"}
                      </span>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setLogoFile(e.target.files[0])} />
                    </label>
                  </div>

                  <motion.button className="btn-primary" onClick={handleGenerate}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{ width: "100%", padding: "18px 0", fontSize: 18 }}>
                    ✦ Generate Ad Creative
                  </motion.button>
                </motion.div>
              )}

              {step === "generating" && (
                <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "70px 24px" }}>
                  <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 36px" }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ position: "absolute", inset: 0, border: "4px solid transparent", borderTopColor: "#7c3aed", borderRadius: "50%" }} />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ position: "absolute", inset: 14, border: "3px solid transparent", borderTopColor: "#e879f9", borderRadius: "50%" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>✨</div>
                  </div>
                  <h3 style={{ fontFamily: "Syne", fontSize: 26, marginBottom: 12, fontWeight: 800, color: "#f0e6ff" }}>Generating your ad...</h3>
                  <p style={{ color: "#6b6b8a", marginBottom: 32, fontSize: 16 }}>AI is crafting your image, copy, and hashtags</p>
                  <div style={{ background: "rgba(124,58,237,0.15)", borderRadius: 100, height: 10, overflow: "hidden", maxWidth: 340, margin: "0 auto" }}>
                    <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
                      style={{ height: "100%", background: "linear-gradient(90deg, #7c3aed, #e879f9)", borderRadius: 100 }} />
                  </div>
                  <p style={{ color: "#a78bfa", marginTop: 12, fontSize: 15 }}>{Math.round(progress)}%</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28, fontSize: 15, color: "#6b6b8a" }}>
                    {["Rewriting prompt with AI...", "Generating image...", "Writing caption...", "Saving to database..."].map((s, i) => (
                      <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                        <span style={{ color: progress > i * 25 ? "#10b981" : "#6b6b8a", fontSize: 16 }}>{progress > i * 25 ? "✓" : "○"}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "result" && result && (
                <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 16 }}>
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Headline</label>
                    <p style={{ color: "#f0e6ff", fontFamily: "Syne", fontWeight: 800, fontSize: 22, lineHeight: 1.3 }}>{result.headline}</p>
                  </div>
                  <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 16 }}>
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Caption</label>
                    <p style={{ color: "#f0e6ff", lineHeight: 1.8, fontSize: 16 }}>{result.caption}</p>
                  </div>
                  <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 24 }}>
                    <label style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Hashtags</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.hashtags?.split(/[\s\n]+/).filter(Boolean).map((h) => (
                        <span key={h} style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "5px 14px", borderRadius: 100, fontSize: 14, fontFamily: "Syne", fontWeight: 600 }}>{h}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <button className="btn-primary" onClick={handleExport} style={{ padding: "16px 0", fontSize: 16 }}>⬇ Export PNG</button>
                    <button className="btn-ghost" onClick={() => { setStep("input"); setResult(null); }} style={{ padding: "16px 0", fontSize: 16 }}>🔄 New Ad</button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── RIGHT: Canvas always mounted ── */}
          <div style={{ position: "sticky", top: 100 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17, color: "#a78bfa", marginBottom: 18, textTransform: "uppercase", letterSpacing: 1 }}>
              Live Preview
            </h3>
            <div style={{ position: "relative" }}>
              {step === "input" && !result && (
                <div style={{ position: "absolute", inset: 0, zIndex: 10, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(6,6,14,0.97)", border: "2px dashed rgba(124,58,237,0.3)", color: "#6b6b8a", minHeight: 560 }}>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ fontSize: 64, marginBottom: 20 }}>🎨</motion.div>
                  <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: "#f0e6ff" }}>Your ad will appear here</p>
                  <p style={{ fontSize: 14, color: "#4b4b6a", marginTop: 8 }}>Fill in the form and generate</p>
                </div>
              )}
              <CanvasEditor
                ref={editorRef}
                imageUrl={result?.imageUrl || null}
                headline={result?.headline || ""}
                caption={result?.caption || ""}
                cta="Shop Now"
                tone={form.tone}
              />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}