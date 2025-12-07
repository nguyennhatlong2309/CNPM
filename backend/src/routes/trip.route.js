const express = require("express");
const router = express.Router();
const C = require("../controllers/trip.controller");

router.get("/", C.getAll);
router.get("/MaxMinDate", C.getMaxMinDate);
router.get("/time-range", C.getByTimeRange);
router.get("/:id", C.getById);

router.post("/", C.create);
router.put("/:id", C.update);
router.delete("/:id", C.delete);

module.exports = router;
