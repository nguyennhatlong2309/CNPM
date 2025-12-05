const BusService = require("../services/bus.service");

exports.getAll = async (req, res) => {
  try {
    const data = await BusService.getAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllWDNameRName = async (req, res) => {
  try {
    const data = await BusService.getAllWDnameRName();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await BusService.getById(req.params.id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await BusService.create(req.body);
    res.json({ id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    await BusService.update(req.params.id, req.body);
    res.json({ message: "updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await BusService.delete(req.params.id);
    res.json({ message: "deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
