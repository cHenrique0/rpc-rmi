require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");
const Task = require("../models/Task");

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  storage: path.resolve(__dirname, `./${process.env.DATABASE}`),
  logging: false,
});

Task.init(sequelize);

module.exports = sequelize;
