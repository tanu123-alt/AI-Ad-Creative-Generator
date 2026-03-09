<<<<<<< HEAD
export const hashtagPrompt = ({ platform, topic }) => `
Generate hashtags for ${platform}.

Rules:
- Instagram: 8–15
- LinkedIn: 3–5
- Twitter: 1 -8 0000



–2

Return JSON array.
`;
=======
const buildHashtagPrompt = (platform, topic) => {
  const counts = {
    Instagram: "8-15",
    LinkedIn: "3-5",
    Twitter: "1-2",
    Facebook: "5-8",
  };

  return `Generate hashtags for ${platform} about: ${topic}
Rules: Use ${counts[platform] || "5-10"} hashtags. Make them relevant and trending.
Return ONLY a JSON array like: ["#tag1", "#tag2", "#tag3"]`;
};

module.exports = buildHashtagPrompt;
>>>>>>> bf9b5e3432a6c0d2e38dabf24a98689efbf8348f
