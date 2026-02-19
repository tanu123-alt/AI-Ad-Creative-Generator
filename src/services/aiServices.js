// Week-1 Dummy AI Generator

const generateAdContent = async (data) => {

  const { product, audience, platform } = data;

  return {
    headline: `Best ${product} for ${audience}!`,
    caption: `Upgrade your style with ${product}. Perfect for ${audience}.`,
    platform: platform,
    hashtags: `#${product} #${audience} #Sale`,
    cta: "Shop Now"
  };
};

module.exports = { generateAdContent };
