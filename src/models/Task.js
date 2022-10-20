const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../database/db");

class Task extends Model {
  static init(connection) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        title: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.STRING,
        },
        done: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize: connection,
        modelName: "task",
        tableName: "tasks",
      }
    );
  }
}

/* Task.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    done: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "task",
    tableName: "tasks",
  }
); */

module.exports = Task;
