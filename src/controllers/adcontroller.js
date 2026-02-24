const { generateAdContent } = require("../services/aiServices");

exports.generateAd = async (req, res) => {

  try {

    const result = await generateAdContent(req.body);

    res.json(result);

  } catch (error) {

    res.status(500).json({

      error: error.message

    });

  }

};