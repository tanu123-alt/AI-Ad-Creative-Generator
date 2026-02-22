const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/ads
router.post("/", async (req, res) => {
  try {
    const product = req.body.content?.trim();
    if (!product) return res.status(400).json({ error: "Content is required" });

    // Dynamic emojis based on keywords in the product
    let emojis = "✨🛒"; // default emojis
    const lowerProduct = product.toLowerCase();
    if (lowerProduct.includes("shoe")) emojis = "👟🔥";
    else if (lowerProduct.includes("watch")) emojis = "⌚💎";
    else if (lowerProduct.includes("smartwatch")) emojis = "⌚🏃‍♂️💡";
    else if (lowerProduct.includes("headphone")) emojis = "🎧🎶";
    else if (lowerProduct.includes("coffee")) emojis = "☕🔥";

    // Dynamic tone based on product type
    let tone = "friendly, engaging"; // default
    if (lowerProduct.includes("shoe")) tone = "energetic, motivational";
    else if (lowerProduct.includes("watch")) tone = "luxurious, sleek";
    else if (lowerProduct.includes("smartwatch")) tone = "techy, modern, energetic";
    else if (lowerProduct.includes("headphone")) tone = "cool, trendy, immersive";
    else if (lowerProduct.includes("coffee")) tone = "warm, inviting, cozy";

    // Build prompt dynamically
    const prompt = `Write a short advertisement for ${product}. Include a catchy headline, key features, a call-to-action, and sprinkle relevant emojis. Use a ${tone} tone.`;

    // Call Hugging Face Chat API
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1:fastest",
        messages: [
          { role: "system", content: "You are a creative marketing assistant." },
          { role: "user", content: prompt }
        ],
        max_output_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const adText = response.data.choices?.[0]?.message?.content || "";
    const finalAd = `${emojis} ${adText}`;

    res.json({ ad: finalAd });

  } catch (error) {
    console.log("HF STATUS:", error.response?.status);
    console.log("HF DATA:", error.response?.data);
    console.log("HF MESSAGE:", error.message);
    res.status(500).json({ error: "Error generating ad" });
  }
});

module.exports = router;