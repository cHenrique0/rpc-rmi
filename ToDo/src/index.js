require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const taskRouter = require("./routes/taskRoutes");

const app = express();
const port = process.env.APP_PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(require("path").resolve(__dirname, "./public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log(`* Application is runnnig at port: ${port}`);
  console.log(
    `* Click here to start using it: http://localhost:${port}/tasks/list`
  );
});
