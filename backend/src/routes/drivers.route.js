const express = require("express");
const router = express.Router();
const C = require("../controllers/drivers.controller");

router.get("/", C.getAll);
router.get("/getAllWBusRouteUser", C.getAllWBusRouteUser);
router.get("/:id", C.getById);
router.post("/", C.create);
router.put("/:id", C.update);
router.delete("/:id", C.delete);

module.exports = router;
