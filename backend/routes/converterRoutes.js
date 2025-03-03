const express = require("express");
const { saveConversion, getConversions, deleteConversion } = require("../controllers/controllerConverter");
const router = express.Router();

router.post("/save", saveConversion);
router.get("/", getConversions);
router.delete("/:id", deleteConversion);

module.exports = router;
