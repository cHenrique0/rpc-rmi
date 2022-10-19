const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.resolve(__dirname, "../../proto/task.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const TaskService = grpc.loadPackageDefinition(packageDefinition).TaskService;
const client = new TaskService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;
