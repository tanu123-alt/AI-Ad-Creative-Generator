 import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function FeedbackModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = () => {
    if (!rating) return toast.error("Please select a rating");
    toast.success("Thanks for your feedback! 🙏");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>

        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="glass feedback-modal"
          style={{ borderRadius: 24, padding: 36, width: "100%", maxWidth: 440 }}>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
            <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 30 }}>How's your experience?</h3>
            <p style={{ color: "#6b6b8a", marginTop: 8, fontSize: 18 }}>Your feedback helps us improve</p>
          </div>

          {/* Stars */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button key={star} onClick={() => setRating(star)}
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                style={{ background: "none", border: "none", fontSize: 40, cursor: "pointer", filter: star <= rating ? "none" : "grayscale(1) opacity(0.4)" }}>
                ⭐
              </motion.button>
            ))}
          </div>

          {/* Category */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["general", "image quality", "copy quality", "ui/ux", "bug"].map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ padding: "6px 14px", borderRadius: 100, border: `1px solid ${category === c ? "#7c3aed" : "rgba(124,58,237,0.2)"}`, background: category === c ? "rgba(124,58,237,0.2)" : "transparent", color: category === c ? "#e879f9" : "#6b6b8a", cursor: "pointer", fontFamily: "Syne", fontWeight: 600, fontSize: 18, textTransform: "capitalize" }}>
                {c}
              </button>
            ))}
          </div>

          <textarea className="input-field" rows={3} placeholder="Tell us more (optional)..."
            value={message} onChange={(e) => setMessage(e.target.value)}
            style={{ resize: "none", marginBottom: 20 }} />

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Skip</button>
            <button className="btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>Submit Feedback ✓</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}