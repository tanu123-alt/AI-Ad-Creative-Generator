const axios = require("axios");
const fs = require("fs");
const path = require("path");

const HF_TOKEN = process.env.HF_TOKEN;

const generateImage = async (prompt) => {

  try {

    const response = await axios({

      method: "POST",

      url: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",

      headers: {

        Authorization: `Bearer ${HF_TOKEN}`,

        "Content-Type": "application/json",

        Accept: "image/png"

      },

      data: {

        inputs: prompt

      },

      responseType: "arraybuffer"

    });


    const fileName = `ad_${Date.now()}.png`;

    const filePath = path.join(

      __dirname,

      "../../generated",

      fileName

    );

    fs.writeFileSync(filePath, response.data);

    return fileName;


  } catch (error) {

    console.log("IMAGE ERROR:");

    console.log(error.response?.status);

    console.log(error.response?.data?.toString());

    throw new Error("Image generation failed");

  }

};

module.exports = generateImage;