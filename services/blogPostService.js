const { Op } = require('sequelize');

const { BlogPost, Category, User } = require('../models');

const Schema = require('../utils/schema');

const create = async (body, userId) => {
  const { error } = Schema.BlogPost.validate(body);
  if (error) return { status: 400, message: error.details[0].message };

  const { title, content, categoryIds } = body;

  const checkCategories = await Category.findAll({ where: { id: categoryIds } });

  if (checkCategories.length !== categoryIds.length) {
    return { status: 400, message: '"categoryIds" not found' };
  }

  const post = await BlogPost
    .create({ title, content, userId, published: new Date(), updated: new Date() });

  return { status: 201, data: post };
};

const getAll = async () => {
  const posts = await BlogPost.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  if (!posts) return { status: 400, message: 'Posts empty' };

  return { status: 200, data: posts };
};

const getById = async (id) => {
  const post = await BlogPost.findOne({ 
    where: { id },
     include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
   });

  if (!post) return { status: 404, message: 'Post does not exist' };

  return { status: 200, data: post };
};

const update = async (body, id, userId) => {
  if (body.categoryIds) return { status: 400, message: 'Categories cannot be edited' };

  const { error } = Schema.UpdateBlogPost.validate(body);
  if (error) return { status: 400, message: error.details[0].message };

  const checkPost = await BlogPost.findOne({ where: { id } });

  if (userId !== checkPost.userId) return { status: 401, message: 'Unauthorized user' };

  await BlogPost.update(
    { ...body, updated: new Date() },
    { where: { id } },
  );

  const { status, data } = await getById(id);

  return { status, data };
};

const deletePost = async (id, userId) => {
  const checkPost = await BlogPost.findOne({ where: { id } });

  if (!checkPost) return { status: 404, message: 'Post does not exist' };

  if (userId !== checkPost.userId) return { status: 401, message: 'Unauthorized user' };

  await BlogPost.destroy({ where: { id } });

  return { status: 204, message: 'Post deleted with success' };
};

const getByTerm = async (term) => {
  console.log(term);
  if (!term) {
    const allPosts = await getAll();

    return allPosts;
  }

  const filteredPosts = await BlogPost.findAll({
    where: { 
      [Op.or]: [{ title: term }, { content: term }],
    },
     include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  if (!filteredPosts) return { status: 200, data: [] };

  return { status: 200, data: filteredPosts };
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deletePost,
  getByTerm,
};

/* 
  Entendi o uso de passar o id como par??metro, pois somente um usu??rio com token
  autenticado poderia fazer esse POST, e logo isso j?? diz que ?? um usu??rio no sistema.
  E assim podendo checkar se o n??mero de ids cadastrados batem com o que est?? no banco.
  Entendi esses usos atrav??s do PR do Adelino J??nior https://github.com/tryber/sd-010-a-project-blogs-api/pull/10 
*/

/*
  Sobre o uso dos Operators do Sequelize eu s?? consegui atrav??s da documenta????o:
  https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll
  https://sequelize.org/master/manual/model-querying-basics.html
*/