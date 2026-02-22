const axios = require("axios");

const generateAdText = async () => {
  try {
    console.log("TOKEN:", process.env.HF_API_KEY);

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1:fastest", // use a provider-backed model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Write a short advertisement for sports shoes" }
        ],
        max_output_tokens: 50
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Chat response is OpenAI-style
    const text = response.data.choices?.[0]?.message?.content;
    console.log("HF OUTPUT:", text);

    return text;
  } catch (error) {
    console.log("HF STATUS:", error.response?.status);
    console.log("HF DATA:", error.response?.data);
    console.log("HF MESSAGE:", error.message);
    throw new Error("Error generating text");
  }
};

module.exports = { generateAdText };