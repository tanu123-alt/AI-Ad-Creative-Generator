<<<<<<< HEAD
export const contextPrompt = ({ imageDescription, brandTone, platform }) => `
You are a marketing strategist.

Analyze the image and brand tone.

Return JSON:
{
  "message": "",
  "emotion": "",
  "target_audience": ""
}
`;
=======
const buildContextPrompt = (product, audience, platform) => {
  const styleByPlatform = {
    Instagram: "vibrant colors, trendy aesthetic, social-media optimized composition",
    Facebook: "friendly lifestyle scene, bright clean product placement",
    LinkedIn: "minimal, professional, corporate lighting, clean background",
    Twitter: "bold, high contrast, punchy poster style",
  };

  return `Rewrite into a detailed cinematic product advertisement prompt.
Product: ${product}
Audience: ${audience}
Platform style: ${styleByPlatform[platform] || "modern product advertisement, clean composition"}

The product must:
- Be clearly visible and in the foreground
- Be sharply focused
- Look realistic and physical

Include lighting, camera angle, product placement and marketing composition.
Return only the final prompt.`;
};

module.exports = buildContextPrompt;
>>>>>>> bf9b5e3432a6c0d2e38dabf24a98689efbf8348f
