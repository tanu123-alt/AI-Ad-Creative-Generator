import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [typed, setTyped] = useState("");
  const phrases = ["Generate Stunning Ads.", "AI-Powered Creativity.", "Ship Faster."];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    canvas.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { p.vx += dx * 0.00008; p.vy += dy * 0.00008; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    let i = 0;
    setTyped("");
    const interval = setInterval(() => {
      setTyped(phrase.slice(0, i + 1));
      i++;
      if (i >= phrase.length) {
        clearInterval(interval);
        setTimeout(() => setPhraseIndex((prev) => (prev + 1) % phrases.length), 1800);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [phraseIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100vh", background: "#06060e", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {[
        { size: 400, x: "10%", y: "20%", color: "rgba(124,58,237,0.12)", dur: 8 },
        { size: 300, x: "70%", y: "60%", color: "rgba(232,121,249,0.08)", dur: 11 },
        { size: 250, x: "50%", y: "10%", color: "rgba(6,182,212,0.07)", dur: 9 },
      ].map((orb, i) => (
        <motion.div key={i}
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: orb.size, height: orb.size, left: orb.x, top: orb.y, background: `radial-gradient(circle, ${orb.color}, transparent 70%)`, borderRadius: "50%", zIndex: 0, pointerEvents: "none" }} />
      ))}

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 28, fontSize: 20, color: "#a78bfa" }}>
            ✦ AI-Powered Ad Creative Studio
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: "clamp(40px, 7vw, 80px)", fontFamily: "Syne", fontWeight: 1000, lineHeight: 1.1, marginBottom: 16 }}>
          <span className="shimmer-text">AdVantage</span> Gen
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: "clamp(18px, 3vw, 28px)", fontFamily: "Syne", fontWeight: 600, color: "#a78bfa", minHeight: 40, marginBottom: 24 }}>
          {typed}<span style={{ opacity: 0.7 }}>|</span>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ fontSize: 20, color: "#6b6b8a", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Generate professional ad creatives with AI — stunning images, compelling copy, and hashtags in seconds.
        </motion.p>

        <motion.div className="welcome-cta-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button className="btn-primary" onClick={() => navigate("/auth")}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{ padding: "16px 36px", fontSize: 20 }}>
            ✦ Start Creating
          </motion.button>
          <motion.button className="btn-ghost" onClick={() => navigate("/history")}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{ padding: "16px 36px", fontSize: 20 }}>
            View History →
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 60, flexWrap: "nowrap" }}>
  
  {[
    {
      icon: "🎨",
      title: "AI Image Studio",
      desc: "Generate stunning product visuals using Stable Diffusion XL. Logo overlay, CTA badge, and aspect ratio control — all automated.",
      color: "#7c3aed",
    },
    {
      icon: "✍️",
      title: "Smart Copywriting",
      desc: "Groq-powered captions and hashtags tailored to your brand tone — Witty, Professional, Urgent or Inspirational.",
      color: "#e879f9",
    },
    {
      icon: "📊",
      title: "Multi-Platform Ready",
      desc: "Optimized for Instagram, LinkedIn, Facebook and Twitter. Export in Square, Vertical or Horizontal formats instantly.",
      color: "#06b6d4",
    },
  ].map((card) => (
    <motion.div
      key={card.title}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "rgba(13,13,26,0.8)",
        border: `1px solid ${card.color}30`,
        borderRadius: 20,
        padding: "28px 24px",
        width: 240,
        textAlign: "left",
        backdropFilter: "blur(12px)",
        boxShadow: `0 8px 32px ${card.color}15`,
        cursor: "default",
      }}>
      {/* Icon circle */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: `${card.color}20`,
        border: `1px solid ${card.color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        marginBottom: 16,
      }}>
        {card.icon}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "Syne",
        fontWeight: 800,
        fontSize: 16,
        color: "#f0e6ff",
        marginBottom: 10,
      }}>
        {card.title}
      </div>

      {/* Description */}
      <div style={{
        fontSize: 13,
        color: "#6b6b8a",
        lineHeight: 1.7,
      }}>
        {card.desc}
      </div>

      {/* Bottom accent line */}
      <div style={{
        marginTop: 20,
        height: 2,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${card.color}, transparent)`,
      }} />
    </motion.div>
  ))}
</motion.div>
      </div>
    </motion.div>
  );
}