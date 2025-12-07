const express = require("express");
const router = express.Router();
const C = require("../controllers/pickupdropoffpoint.controller");

router.get("/", C.getAll);
router.get("/:id", C.getById);
router.post("/", C.create);
router.post("/multiple", C.createMultiple);

router.put("/delete/multiple", C.deleteMultiple);
router.put("/multiple", C.updateMultiple);
router.put("/delete/:id", C.deletePoint);
router.put("/:id", C.update);

router.delete("/:id", C.delete);

module.exports = router;
