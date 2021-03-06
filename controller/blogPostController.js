const BlogPost = require('../services/blogPostService');

const create = async (req, res) => {
  const { id } = req.user.data;
  
  const { status, data, message } = await BlogPost.create(req.body, id);

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

const getAll = async (_req, res) => {
  const { status, data, message } = await BlogPost.getAll();

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { status, data, message } = await BlogPost.getById(id);

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user.data;

  const { status, data, message } = await BlogPost.update(req.body, id, userId);

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user.data;

  const { status, message } = await BlogPost.deletePost(id, userId);

  return res.status(status).json({ message });
};

const getByTerm = async (req, res) => {
  const { q } = req.query;

  const { status, data, message } = await BlogPost.getByTerm(q);

  if (message) return res.status(status).json({ message });

  return res.status(status).json(data);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deletePost,
  getByTerm,
};
