const generateImage = require("./imageService");
const Ad = require("../models/Ad");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ============================= */
/* 1️⃣ Prompt Rewrite (Image) */
/* ============================= */

const rewritePromptForImage = async (product, audience, platform) => {
  const styleByPlatform = {
    Instagram: "vibrant colors, trendy aesthetic, shallow depth of field",
    Facebook: "friendly lifestyle scene, bright and clean composition",
    LinkedIn: "minimal, corporate lighting, professional background",
    Twitter: "bold contrast, poster-style layout, dramatic lighting",
  };

  const style =
    styleByPlatform[platform] || "modern product advertisement, clean composition";

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a professional advertising creative director who rewrites prompts for high-quality image generation.",
      },
      {
        role: "user",
        content: `
Rewrite this into a highly detailed cinematic image prompt.

Product: ${product}
Target Audience: ${audience}
Platform Style: ${style}

Include:
- Lighting details
- Mood and emotion
- Camera angle
- Background elements
- Marketing aesthetics

Return ONLY the final enhanced prompt.
`,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
};

/* ============================= */
/* 2️⃣ Caption Generator */
/* ============================= */

const generateMarketingCaption = async (product, audience, tone) => {
  const toneMap = {
    witty: "clever and playful",
    professional: "corporate and confident",
    urgent: "persuasive and urgency-driven",
    inspirational: "emotional and motivational",
  };

  const selectedTone = toneMap[tone] || toneMap.professional;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert social media marketing copywriter.",
      },
      {
        role: "user",
        content: `
Write a short, high-converting social media caption.

Product: ${product}
Target Audience: ${audience}
Tone: ${selectedTone}

Keep it concise, persuasive and platform-optimized.
Return ONLY the caption.
`,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
};

/* ============================= */
/* 3️⃣ Main Ad Generator */
/* ============================= */

const generateAdContent = async (data) => {
  try {
    const {
      product,
      audience,
      platform = "Instagram",
      tone = "professional",
    } = data;

    if (!product || !audience) {
      throw new Error("Product and Audience are required");
    }

    const headline = `Best ${product} for ${audience}!`;

    const caption = await generateMarketingCaption(
      product,
      audience,
      tone
    );

    const hashtags = `#${product.replace(/\s+/g, "")}
#${audience.replace(/\s+/g, "")}
#${platform}
#AdCampaign`;

    const enhancedPrompt = await rewritePromptForImage(
      product,
      audience,
      platform
    );

    const imageName = await generateImage(enhancedPrompt, {
      aspect: data.aspect || "square",
      logoPath: data.logoPath || null,
    });

    const newAd = new Ad({
      product,
      audience,
      platform,
      headline,
      caption,
      hashtags,
      image: imageName,
    });

    await newAd.save();

    return {
      headline,
      caption,
      hashtags,
      image: imageName,
      imageUrl: `/generated/${imageName}`,
    };

  } catch (error) {
    console.log("AI SERVICE ERROR:", error.message);
    throw new Error("Ad generation failed");
  }
};

module.exports = { generateAdContent };