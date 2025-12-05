const express = require("express");
const router = express.Router();
const Bus = require("../controllers/bus.controller");

router.get("/", Bus.getAll);
router.get("/WDNameRName", Bus.getAllWDNameRName);
router.get("/:id", Bus.getById);
router.post("/", Bus.create);
router.put("/:id", Bus.update);
router.delete("/:id", Bus.delete);

module.exports = router;
