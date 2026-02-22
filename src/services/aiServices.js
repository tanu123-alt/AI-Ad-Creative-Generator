<<<<<<< HEAD
const axios = require("axios");

const generateAdText = async () => {
  try {
    console.log("TOKEN:", process.env.HF_API_KEY);

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1:fastest", // use a provider-backed model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Write a short advertisement for sports shoes" }
        ],
        max_output_tokens: 50
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Chat response is OpenAI-style
    const text = response.data.choices?.[0]?.message?.content;
    console.log("HF OUTPUT:", text);

    return text;
  } catch (error) {
    console.log("HF STATUS:", error.response?.status);
    console.log("HF DATA:", error.response?.data);
    console.log("HF MESSAGE:", error.message);
    throw new Error("Error generating text");
  }
=======
// src/services/aiServices.js
const axios = require("axios");
const Ad = require("../models/Ad");

// Load API key and URL from .env
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_URL = process.env.HUGGINGFACE_API_URL;

const generateAdContent = async (data) => {
  try {
    const { product, audience, platform } = data;

    // --- TEXT GENERATION ---
    const headline = `Best ${product} for ${audience}!`;
    const caption = `Upgrade your style with ${product}. Perfect for ${audience}.`;
    const hashtags = `#${product} #${audience} #Sale`;
    const cta = "Shop Now";

<<<<<<< Updated upstream
  return {
    headline: `Best ${product} for ${audience}!`,
    caption: `Upgrade your style with ${product}. Perfect for ${audience}.`,
    platform: platform,
    hashtags: `#${product} #${audience} #Sale`,
    cta: "Shop Now"
  };
=======
    // --- IMAGE GENERATION ---
    const response = await axios({
      method: "POST",
      url: HF_URL, // Using the correct Hugging Face API URL
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        inputs: `${product} advertisement for ${audience}`, // prompt
      },
      responseType: "arraybuffer", // get raw image data
    });

    // Convert image to base64 for storage/display
    const imageBase64 = Buffer.from(response.data, "binary").toString("base64");
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // --- SAVE TO DATABASE ---
    const newAd = new Ad({
      product,
      audience,
      platform,
      headline,
      caption,
      hashtags,
      cta,
      imageUrl,
    });

    await newAd.save();

    return {
      headline,
      caption,
      hashtags,
      cta,
      platform,
      imageUrl,
    };
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Image generation failed");
  }
>>>>>>> Stashed changes
>>>>>>> origin/main
};

module.exports = { generateAdText };