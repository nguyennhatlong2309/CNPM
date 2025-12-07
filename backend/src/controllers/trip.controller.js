const Service = require("../services/trip.service");

exports.getAll = async (req, res) => {
  try {
    res.json(await Service.getAll());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMaxMinDate = async (req, res) => {
  try {
    res.json(await Service.getMaxMinDate());
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

exports.getByTimeRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate và endDate là bắt buộc" });
    }

    const trips = await Service.getByTimeRange(startDate, endDate);
    res.json(trips);
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
