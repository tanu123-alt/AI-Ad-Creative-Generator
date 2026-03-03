export const captionPrompt = ({ message, emotion, platform, cta }) => `
Write a ${platform} caption.

Message: ${message}
Emotion: ${emotion}
CTA: ${cta}

Return only the caption text.
`;