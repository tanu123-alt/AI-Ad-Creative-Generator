const { generateAdContent } = require("../services/aiServices");

const Ad = require("../models/Ad");

// Generate Ad
exports.generateAd = async (req, res) => {
  try {
    const logoPath = req.file?.path || null;
    const result = await generateAdContent({ ...req.body, logoPath });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all saved ads (for History page)
exports.getAds = async (req, res) => {
  try {
    const { platform, tone } = req.query;
    const query = {};
    if (platform && platform !== "all") query.platform = platform;
    if (tone && tone !== "all") query.tone = tone;

    const ads = await Ad.find(query).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete ad
exports.deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Ad deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
