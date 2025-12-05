const Service = require("../services/detailtrips.service");

exports.getAll = async (req, res) => {
  try {
    res.json(await Service.getAll());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    res.json(await Service.getById(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.json({ id: await Service.create(req.body) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Service.update(req.params.id, req.body);
    res.json({ message: "updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.json({ message: "deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
