const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const HF_TOKEN = process.env.HF_TOKEN;

const generateImage = async (prompt, options = {}) => {
  try {
    const { aspect = "square", logoPath = null } = options;

    const response = await axios({
  method: "POST",
  url: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
  headers: {
    Authorization: `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "image/png",
  },
  data: { inputs: prompt },
  responseType: "arraybuffer",
  timeout: 120000,
  validateStatus: () => true,
});

if (response.status !== 200) {
  console.log("HF STATUS:", response.status);
  console.log("HF BODY:", Buffer.from(response.data).toString());
  throw new Error("Image generation failed");
}

    let width = 1024;
    let height = 1024;

    if (aspect === "vertical") {
      width = 768;
      height = 1024;
    }

    if (aspect === "horizontal") {
      width = 1024;
      height = 768;
    }

    const baseImage = sharp(response.data).resize(width, height);

    let compositeOptions = [];

    // LOGO OVERLAY DEBUG
console.log("Received logoPath:", logoPath);

if (logoPath) {
  console.log("Exists:", fs.existsSync(logoPath));
}

if (logoPath && fs.existsSync(logoPath)) {
  const logoBuffer = await sharp(logoPath)
    .resize(150)
    .png()
    .toBuffer();

  compositeOptions.push({
    input: logoBuffer,
    gravity: "southeast"
  });
}
    // CTA BADGE
    const ctaBadge = await sharp({
      create: {
        width: 300,
        height: 80,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0.6 }
      }
    })
      .png()
      .toBuffer();

    compositeOptions.push({
      input: ctaBadge,
      gravity: "south"
    });

    const finalImage = await baseImage
      .composite(compositeOptions)
      .png()
      .toBuffer();

    const fileName = `ad_${Date.now()}.png`;
    const filePath = path.join(__dirname, "../../generated", fileName);

    fs.writeFileSync(filePath, finalImage);

    return fileName;

  } catch (error) {
    console.log("IMAGE ERROR:", error.response?.data?.toString() || error.message);
    throw new Error("Image generation failed");
  }
};

module.exports = generateImage;