const Conversion = require("../models/Conversion");

const saveConversion = async (req, res) => {
  try {
    const { input, customBase } = req.body; // Expecting only input and custom base

    // Validate the input number
    const num = parseInt(input);
    if (isNaN(num)) {
      return res.status(400).json({ message: "Invalid number input" });
    }

    // Convert input to different bases
    const binary = num.toString(2);
    const octal = num.toString(8);
    const hexadecimal = num.toString(16).toUpperCase();
    const decimal = num.toString(10);
    const customBaseValue = customBase ? num.toString(customBase) : "N/A";

    // Create and save new conversion
    const newConversion = new Conversion({
      input,
      binary,
      octal,
      hexadecimal,
      decimal,
      customBase: customBaseValue,
    });

    await newConversion.save();
    res.status(201).json({ message: "Conversion saved", conversion: newConversion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all saved conversions
const getConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find();
    res.status(200).json(conversions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a conversion by ID
const deleteConversion = async (req, res) => {
  try {
    const { id } = req.params;
    await Conversion.findByIdAndDelete(id);
    res.status(200).json({ message: "Conversion deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { saveConversion, getConversions, deleteConversion };
