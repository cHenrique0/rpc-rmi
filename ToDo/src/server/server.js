const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
var fs = require("fs");

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "../../proto/task.proto")
);
const taskProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const taskData = fs.readFileSync(
  path.resolve(__dirname, "../database/tasks.json")
);
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

server.addService(taskProto.TaskService.service, { getAll, getOne });

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Server is running at port 50051");
  }
);
