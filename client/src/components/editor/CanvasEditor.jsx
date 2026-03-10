import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

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

const CANVAS_SIZE = 540;

const CanvasEditor = forwardRef(({ imageUrl, headline, caption, cta, logoUrl, tone }, ref) => {
  const containerRef = useRef(null);
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);       // fabric canvas instance
  const isReadyRef = useRef(false);     // REF not state — no stale closures ever
  const pendingUrlRef = useRef(null);   // stores URL if canvas not ready yet
  const headlineRef = useRef(null);
  const captionRef = useRef(null);
  const ctaGroupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    exportPNG: (ratio = "1:1") => {
      if (!fabricRef.current) return null;
      const [w, h] = ratioSizes[ratio] || [1080, 1080];
      const scale = Math.max(w / CANVAS_SIZE, h / CANVAS_SIZE);
      return fabricRef.current.toDataURL({ format: "png", multiplier: scale });
    },
  }));

  // loadBackground: uses fabric.Image.fromURL (the correct Fabric API)
  const loadBackground = (url) => {
    const fc = fabricRef.current;
    if (!fc || !url || !window.fabric) return;

    // Ensure absolute URL for crossOrigin to work correctly
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    const urlWithBust = fullUrl + "?t=" + Date.now();

    console.log("🖼 Loading canvas image:", urlWithBust);

    window.fabric.Image.fromURL(
      urlWithBust,
      (img) => {
        if (!fabricRef.current) return;
        if (!img || !img.width || !img.height) {
          console.error("❌ Image failed to load:", urlWithBust);
          return;
        }
        img.set({
          selectable: false,
          evented: false,
          scaleX: CANVAS_SIZE / img.width,
          scaleY: CANVAS_SIZE / img.height,
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
        });
        fabricRef.current.setBackgroundImage(img, () => {
          fabricRef.current.renderAll();
          console.log("✅ Canvas image rendered successfully");
        });
      },
      { crossOrigin: "anonymous" }
    );
  };

  // Init Fabric once on mount
  useEffect(() => {
    if (!canvasElRef.current) return;

    const tryInit = () => {
      if (!window.fabric) {
        setTimeout(tryInit, 100);
        return;
      }

      const fabric = window.fabric;

      const fc = new fabric.Canvas(canvasElRef.current, {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        selection: true,
        preserveObjectStacking: true,
      });
      fabricRef.current = fc;

      fc.setBackgroundColor("#1a1a2e", fc.renderAll.bind(fc));

      // Gradient overlay
      const gradH = CANVAS_SIZE * 0.5;
      fc.add(
        new fabric.Rect({
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
        })
      );

      // Headline text
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
      fc.add(hl);

      // Caption text
      const cap = new fabric.IText("", {
        left: 20,
        top: CANVAS_SIZE * 0.73,
        width: CANVAS_SIZE - 40,
        fontSize: 15,
        fontFamily: "Arial",
        fill: "rgba(255,255,255,0.92)",
        lineHeight: 1.5,
        shadow: "rgba(0,0,0,0.8) 1px 1px 6px",
      });
      captionRef.current = cap;
      fc.add(cap);

      // CTA button group
      const ctaRect = new fabric.Rect({
        width: 160,
        height: 46,
        rx: 12,
        ry: 12,
        fill: toneColors[tone] || "#7c3aed",
        shadow: "rgba(0,0,0,0.5) 2px 4px 12px",
      });
      const ctaText = new fabric.Text(cta || "Shop Now", {
        fontSize: 17,
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
      fc.add(ctaGroup);

      // Tone badge
      const bRect = new fabric.Rect({
        width: 130,
        height: 32,
        rx: 16,
        ry: 16,
        fill: `${toneColors[tone] || "#7c3aed"}35`,
        stroke: toneColors[tone] || "#7c3aed",
        strokeWidth: 1.5,
      });
      const bText = new fabric.Text((tone || "professional").toUpperCase(), {
        fontSize: 12,
        fontFamily: "Arial Black",
        fill: toneColors[tone] || "#7c3aed",
        originX: "center",
        originY: "center",
        left: 65,
        top: 16,
      });
      fc.add(
        new fabric.Group([bRect, bText], {
          left: 16,
          top: 16,
          selectable: false,
          evented: false,
        })
      );

      fc.renderAll();

      // Mark ready via REF — avoids stale closure problem entirely
      isReadyRef.current = true;

      // If image arrived before canvas was ready, load it now
      if (pendingUrlRef.current) {
        loadBackground(pendingUrlRef.current);
        pendingUrlRef.current = null;
      }
    };

    tryInit();

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
        isReadyRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only runs once

  // React to imageUrl changes
  useEffect(() => {
    if (!imageUrl) return;

    if (isReadyRef.current && fabricRef.current) {
      // Canvas ready — load immediately
      loadBackground(imageUrl);
    } else {
      // Canvas not ready yet — queue it
      console.log("⏳ Canvas not ready, queuing image:", imageUrl);
      pendingUrlRef.current = imageUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]); // only imageUrl as dep — no stale state issue

  // Update text / tone / logo when props change
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc || !isReadyRef.current) return;

    if (headlineRef.current) {
      headlineRef.current.set({ text: headline || "" });
    }

    if (captionRef.current) {
      const txt =
        caption && caption.length > 120
          ? caption.slice(0, 120) + "..."
          : caption || "";
      captionRef.current.set({ text: txt });
    }

    if (ctaGroupRef.current) {
      const rect = ctaGroupRef.current.item(0);
      if (rect) rect.set({ fill: toneColors[tone] || "#7c3aed" });
    }

    if (logoUrl && window.fabric) {
      window.fabric.Image.fromURL(
        logoUrl,
        (img) => {
          if (!fabricRef.current) return;
          img.scaleToWidth(72);
          img.set({ left: CANVAS_SIZE - 92, top: 14 });
          fabricRef.current.add(img);
          fabricRef.current.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    fc.renderAll();
  }, [headline, caption, tone, logoUrl]);

  return (
    <div ref={containerRef} style={{ width: CANVAS_SIZE, maxWidth: "100%", margin: "0 auto" }}>
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          border: "2px solid rgba(124,58,237,0.4)",
          background: "#0d0d1a",
          boxShadow: "0 20px 60px rgba(124,58,237,0.2)",
          width: CANVAS_SIZE,
        }}
      >
        <canvas
          ref={canvasElRef}
          style={{ display: "block", width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />
        <div
          style={{
            padding: "12px 18px",
            background: "rgba(13,13,26,0.95)",
            borderTop: "1px solid rgba(124,58,237,0.2)",
            fontSize: 12,
            color: "#6b6b8a",
            fontFamily: "Syne",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
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