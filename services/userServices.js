const jwt = require('jsonwebtoken');

const { User } = require('../models');

const Schema = require('../utils/schema');

const SECRET = 'testedoprojeto';
const jwtConfig = {
  expiresIn: '5d',
  algorithm: 'HS256',
};

const findEmail = async (email) => {
  const checkEmail = await User.findOne({ where: { email } });
  return checkEmail;
};

const create = async (body) => {
  const { error } = Schema.User.validate(body);
  if (error) return { status: 400, message: error.details[0].message };

  const email = await findEmail(body.email);
  if (email) return { status: 409, message: 'User already registered' };

  const user = await User.create(body);

  const token = jwt.sign({ data: user.dataValues }, SECRET, jwtConfig);

  return { status: 201, data: { token } };
};

module.exports = {
  create,
};
