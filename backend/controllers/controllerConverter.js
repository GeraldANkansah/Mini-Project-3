// controllerConverter.js
const Conversion = require("../models/Conversion");

// Function to convert number to Roman Numerals
const toRoman = (num) => {
  const romanMap = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let result = "";
  for (let key in romanMap) {
    while (num >= romanMap[key]) {
      result += key;
      num -= romanMap[key];
    }
  }
  return result;
};

const saveConversion = async (req, res) => {
  try {
    const { input, customBase } = req.body;
    const num = parseInt(input);
    if (isNaN(num) || num <= 0 || num > 3999) {
      return res.status(400).json({ message: "Invalid number input (1-3999 supported for Roman Numerals)" });
    }

    const binary = num.toString(2);
    const octal = num.toString(8);
    const hexadecimal = num.toString(16).toUpperCase();
    const decimal = num.toString(10);
    const romanNumeral = toRoman(num);
    const customBaseValue = customBase ? num.toString(customBase) : "N/A";

    const newConversion = new Conversion({
      input,
      binary,
      octal,
      hexadecimal,
      decimal,
      romanNumeral,
      customBase: customBaseValue,
    });

    await newConversion.save();
    res.status(201).json({ message: "Conversion saved", conversion: newConversion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find();
    res.status(200).json(conversions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

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