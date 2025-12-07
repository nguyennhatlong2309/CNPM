const Service = require("../services/pickupdropoffpoint.service");

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

exports.createMultiple = async (req, res) => {
  try {
    const firstId = await Service.createMultiple(req.body); // body là mảng points
    res.json({ message: "Inserted successfully", firstId });
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

exports.updateMultiple = async (req, res) => {
  try {
    await Service.updateMultiple(req.body);
    res.json({ message: "updated multiple" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deletePoint = async (req, res) => {
  try {
    await Service.deletePoint(req.params.id);
    res.json({ message: "soft deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteMultiple = async (req, res) => {
  try {
    console.log(req.body);
    const count = await Service.deleteMultiple(req.body);
    res.json({ message: `${count} points soft deleted` });
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
