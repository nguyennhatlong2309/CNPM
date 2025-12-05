const express = require("express");
const router = express.Router();
const C = require("../controllers/route.controller");

router.get("/", C.getAll);
router.get("/:id", C.getById);
router.post("/", C.create);
router.put("/:id", C.update);
router.delete("/:id", C.delete);

module.exports = router;
