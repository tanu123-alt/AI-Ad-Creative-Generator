import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

const ratioSizes = {
  "1:1": [1080, 1080],
  "9:16": [1080, 1920],
  "16:9": [1920, 1080],
};

const toneColors = {
  witty: "#f59e0b",
  professional: "#06b6d4",
  urgent: "#ef4444",
  inspirational: "#10b981",
};

const CanvasEditor = forwardRef(({ imageUrl, headline, caption, cta, logoUrl, tone }, ref) => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const headlineRef = useRef(null);
  const captionRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const CANVAS_SIZE = 540;

  useImperativeHandle(ref, () => ({
    exportPNG: (ratio = "1:1") => {
      if (!fabricCanvas.current) return null;
      const [w, h] = ratioSizes[ratio] || [1080, 1080];
      const scaleX = w / fabricCanvas.current.getWidth();
      const scaleY = h / fabricCanvas.current.getHeight();
      return fabricCanvas.current.toDataURL({
        format: "png",
        multiplier: Math.max(scaleX, scaleY),
      });
    },
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const initFabric = () => {
      if (!window.fabric) {
        setTimeout(initFabric, 100);
        return;
      }

      const fabric = window.fabric;
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        selection: true,
      });
      fabricCanvas.current = canvas;

      canvas.setBackgroundColor("#1a1a2e", canvas.renderAll.bind(canvas));

      // Gradient overlay bottom half
      const gradH = CANVAS_SIZE * 0.5;
      const gradientOverlay = new fabric.Rect({
        width: CANVAS_SIZE,
        height: gradH,
        top: CANVAS_SIZE - gradH,
        left: 0,
        selectable: false,
        evented: false,
        fill: new fabric.Gradient({
          type: "linear",
          coords: { x1: 0, y1: 0, x2: 0, y2: gradH },
          colorStops: [
            { offset: 0, color: "rgba(0,0,0,0)" },
            { offset: 1, color: "rgba(0,0,0,0.92)" },
          ],
        }),
      });
      canvas.add(gradientOverlay);

      // Headline
      const hl = new fabric.IText("", {
        left: 20,
        top: CANVAS_SIZE * 0.56,
        width: CANVAS_SIZE - 40,
        fontSize: 34,
        fontFamily: "Arial Black",
        fontWeight: "bold",
        fill: "white",
        shadow: "rgba(0,0,0,1) 3px 3px 12px",
        lineHeight: 1.2,
      });
      headlineRef.current = hl;
      canvas.add(hl);

      // Caption
      const cap = new fabric.IText("", {
        left: 20,
        top: CANVAS_SIZE * 0.73,
        width: CANVAS_SIZE - 40,
        fontSize: 16,
        fontFamily: "Arial",
        fill: "rgba(255,255,255,0.92)",
        lineHeight: 1.5,
        shadow: "rgba(0,0,0,0.8) 1px 1px 6px",
      });
      captionRef.current = cap;
      canvas.add(cap);

      // CTA button
      const ctaRect = new fabric.Rect({
        width: 160,
        height: 46,
        rx: 12,
        ry: 12,
        fill: toneColors[tone] || "#7c3aed",
        shadow: "rgba(0,0,0,0.5) 2px 4px 12px",
      });
      const ctaText = new fabric.Text(cta || "Shop Now", {
        fontSize: 18,
        fontFamily: "Arial Black",
        fontWeight: "bold",
        fill: "white",
        originX: "center",
        originY: "center",
        left: 80,
        top: 23,
      });
      const ctaGroup = new fabric.Group([ctaRect, ctaText], {
        left: 20,
        top: CANVAS_SIZE * 0.87,
      });
      ctaGroupRef.current = ctaGroup;
      canvas.add(ctaGroup);

      // Tone badge top left
      const badgeRect = new fabric.Rect({
        width: 130,
        height: 32,
        rx: 16,
        ry: 16,
        fill: `${toneColors[tone] || "#7c3aed"}35`,
        stroke: toneColors[tone] || "#7c3aed",
        strokeWidth: 1.5,
      });
      const badgeText = new fabric.Text((tone || "professional").toUpperCase(), {
        fontSize: 12,
        fontFamily: "Arial Black",
        fill: toneColors[tone] || "#7c3aed",
        originX: "center",
        originY: "center",
        left: 65,
        top: 16,
      });
      const badge = new fabric.Group([badgeRect, badgeText], {
        left: 16,
        top: 16,
        selectable: false,
        evented: false,
      });
      canvas.add(badge);

      canvas.renderAll();
      setCanvasReady(true);
    };

    initFabric();

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, []);

  // Load background image
  useEffect(() => {
    if (!canvasReady || !imageUrl || !fabricCanvas.current) return;

    console.log("Loading image:", imageUrl);

    const imgEl = new Image();
    imgEl.crossOrigin = "anonymous";

    imgEl.onload = () => {
      if (!fabricCanvas.current || !window.fabric) return;
      const fabric = window.fabric;
      const canvas = fabricCanvas.current;

      const fabricImg = new fabric.Image(imgEl, {
        selectable: false,
        evented: false,
      });

      fabricImg.set({
        scaleX: canvas.width / imgEl.naturalWidth,
        scaleY: canvas.height / imgEl.naturalHeight,
      });

      canvas.setBackgroundImage(fabricImg, () => {
        canvas.renderAll();
        console.log("✅ Image loaded into canvas");
      });
    };

    imgEl.onerror = () => {
      console.error("❌ Image failed to load:", imageUrl);
    };

    imgEl.src = imageUrl + "?t=" + Date.now();
  }, [canvasReady, imageUrl]);

  // Update text tone logo
  useEffect(() => {
    if (!canvasReady || !fabricCanvas.current) return;
    const canvas = fabricCanvas.current;

    if (headlineRef.current) {
      headlineRef.current.set({ text: headline || "" });
    }

    if (captionRef.current) {
      const text = caption
        ? caption.slice(0, 110) + (caption.length > 110 ? "..." : "")
        : "";
      captionRef.current.set({ text });
    }

    if (ctaGroupRef.current) {
      const rect = ctaGroupRef.current.item(0);
      if (rect) rect.set({ fill: toneColors[tone] || "#7c3aed" });
    }

    if (logoUrl && window.fabric) {
      const logoEl = new Image();
      logoEl.crossOrigin = "anonymous";
      logoEl.onload = () => {
        if (!fabricCanvas.current || !window.fabric) return;
        const fabricLogo = new window.fabric.Image(logoEl);
        fabricLogo.scaleToWidth(72);
        fabricLogo.set({
          left: CANVAS_SIZE - 92,
          top: 14,
        });
        canvas.add(fabricLogo);
        canvas.renderAll();
      };
      logoEl.src = logoUrl;
    }

    canvas.renderAll();
  }, [canvasReady, headline, caption, tone, logoUrl]);

  return (
    <div style={{
      width: CANVAS_SIZE,
      maxWidth: "100%",
      margin: "0 auto",
    }}>
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        border: "2px solid rgba(124,58,237,0.4)",
        background: "#0d0d1a",
        boxShadow: "0 20px 60px rgba(124,58,237,0.2)",
        width: CANVAS_SIZE,
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
          }}
        />
        <div style={{
          padding: "12px 18px",
          background: "rgba(13,13,26,0.95)",
          borderTop: "1px solid rgba(124,58,237,0.2)",
          fontSize: 12,
          color: "#6b6b8a",
          fontFamily: "Syne",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}>
          <span style={{ color: "#a78bfa" }}>✦</span>
          <span>Double-click text to edit</span>
          <span style={{ marginLeft: "auto" }}>Drag to reposition</span>
        </div>
      </div>
    </div>
  );
});

CanvasEditor.displayName = "CanvasEditor";
export default CanvasEditor;