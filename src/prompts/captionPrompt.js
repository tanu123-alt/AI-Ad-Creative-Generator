
export const captionPrompt = ({ message, emotion, platform, cta }) => `
Write a ${platform} caption.

Message: ${message}
Emotion: ${emotion}
CTA: ${cta}

Return only the caption text.
`;
const buildCaptionPrompt = (product, audience, tone) => {
  const toneMap = {
    witty: "clever and playful",
    professional: "corporate and confident",
    urgent: "persuasive and urgency-driven",
    inspirational: "emotional and motivational",
  };
  return `Write a short high-converting social media caption.
Product: ${product}
Audience: ${audience}
Tone: ${toneMap[tone] || toneMap.professional}
Return ONLY the caption.`;
};

module.exports = buildCaptionPrompt;

