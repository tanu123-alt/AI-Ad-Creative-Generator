const { generateAdText } = require("../services/aiServices");

const generateAd = async (req, res) => {
  try {
    const result = await generateAdText();

    res.json({
      adText: result[0]?.generated_text || result
    });

  } catch (error) {
    res.status(500).json({ error: "Error generating text" });
  }
};

module.exports = { generateAd };