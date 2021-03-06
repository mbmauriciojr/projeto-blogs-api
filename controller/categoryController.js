const Category = require('../services/categoryService');

const create = async (req, res) => {
  const { status, data, message } = await Category.create(req.body);

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

const getAll = async (_req, res) => {
  const { status, data, message } = await Category.getAll();

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

module.exports = {
  create,
  getAll,
};
