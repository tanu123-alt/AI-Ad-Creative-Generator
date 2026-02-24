const generateImage = require("./imageService");

const Ad = require("../models/Ad");

const generateAdContent = async (data) => {

  try {

    const { product, audience, platform } = data;

    const headline = `Best ${product} for ${audience}!`;

    const caption =
      `Upgrade your style with ${product}. Perfect for ${audience}.`;

    const hashtags =
      `#${product} #${audience} #${platform}`;

    const imageName = await generateImage(

      `${product} for ${audience}, advertising, high quality`

    );

    const newAd = new Ad({

      product,
      audience,
      platform,
      headline,
      caption,
      hashtags,
      image: imageName

    });

    await newAd.save();

    return {

      headline,
      caption,
      hashtags,
      image: imageName

    };

  } catch (error) {

    console.log(error.message);

    throw error;

  }

};

module.exports = { generateAdContent };