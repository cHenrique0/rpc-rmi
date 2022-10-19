const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
var fs = require("fs");

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "../../proto/task.proto")
);
const taskProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const taskDB = path.resolve(__dirname, "../database/tasks.json");
const taskData = fs.readFileSync(taskDB);
const tasks = JSON.parse(taskData);

const getAll = (_, callback) => {
  return callback(null, { tasks });
};

const getOne = (call, callback) => {
  let task = tasks.find((n) => n.id == call.request.id);
  if (!task) {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
    return;
  }
  return callback(null, task);
};

const insert = (call, callback) => {
  let newTask = call.request;

  tasks.push({ ...newTask });

  const jsonString = JSON.stringify(tasks, null, 2);

  fs.writeFile(taskDB, jsonString, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });

  callback(null, newTask);
};

server.addService(taskProto.TaskService.service, { getAll, getOne, insert });

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Server is running at port 50051");
  }
);
