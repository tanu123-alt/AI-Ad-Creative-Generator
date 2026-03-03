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