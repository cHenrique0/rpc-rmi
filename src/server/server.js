const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Task = require("../models/Task");
const database = require("../database/db");
const { Op } = require("sequelize");

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "../../proto/task.proto")
);
const taskProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const getAll = async (_, callback) => {
  const tasks = await Task.findAll();
  return callback(null, { tasks });
};

const getById = async (call, callback) => {
  const task = await Task.findByPk(call.request.id);
  if (!task) {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
    return;
  }
  return callback(null, task);
};

const filterTasks = async (call, callback) => {
  let title = call.request.title;
  let done = call.request.done;
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : undefined;

  if (done === true) {
    condition = { done: true };
  }
  if (done === false) {
    condition = { done: false };
  }

  const tasks = await Task.findAll({
    where: condition,
    raw: true,
  });
  return callback(null, { tasks });
};

const insert = async (call, callback) => {
  let newTask = call.request;

  await Task.create({ ...newTask }).then((task) => {
    if (!task) {
      return callback({
        code: grpc.status.INTERNAL,
        details: "Error creating task",
      });
    }
  });

  callback(null, newTask);
};

const remove = async (call, callback) => {
  await Task.findByPk(call.request.id).then(async (task) => {
    if (!task) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
    await Task.destroy({ where: { id: task.id } }).then((deletedRow) => {
      if (deletedRow === 0) {
        return callback({
          code: grpc.status.INTERNAL,
          details: "Error deleting task",
        });
      }
    });
  });

  callback(null, {});
};

const update = async (call, callback) => {
  const existingTask = await Task.findByPk(call.request.id);

  if (!existingTask) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
  }

  await Task.update(
    { ...call.request },
    { where: { id: existingTask.id } }
  ).then((updatedRow) => {
    if ([updatedRow] === 0) {
      return callback({
        code: grpc.status.INTERNAL,
        details: "Error updating task",
      });
    }
  });

  callback(null, call.request);
};

const done = async (call, callback) => {
  const existingTask = await Task.findByPk(call.request.id, { raw: true });

  if (!existingTask) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
  }

  existingTask.done = existingTask.done ? false : true;

  await Task.update(
    { ...existingTask },
    { where: { id: existingTask.id } }
  ).then((updatedRow) => {
    if ([updatedRow] === 0) {
      return callback({
        code: grpc.status.INTERNAL,
        details: "Error updating task",
      });
    }
  });

  callback(null, existingTask);
};

server.addService(taskProto.TaskService.service, {
  getAll,
  getById,
  filterTasks,
  insert,
  remove,
  update,
  done,
});

database
  .sync()
  .then(() => {
    console.log("* Database synced succefully");
    server.bindAsync(
      "0.0.0.0:50051",
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start();
        console.log("Server is running at port 50051");
      }
    );
  })
  .catch((err) => {
    console.log(err);
  });
