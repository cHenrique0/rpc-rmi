const { Router } = require("express");
const TaskController = require("../controllers/TaskController");
const taskRouter = Router();

taskRouter.get("/list", TaskController.getAll);

taskRouter.get("/create", TaskController.createTaskView);

taskRouter.post("/create", TaskController.createTask);

taskRouter.post("/delete/:id", TaskController.deleteTask);

taskRouter.post("/edit/:uuid", TaskController.updateTask);

taskRouter.get("/edit/:uuid", TaskController.updateTaskView);

taskRouter.post("/done/:uuid", TaskController.doneTask);

module.exports = taskRouter;
