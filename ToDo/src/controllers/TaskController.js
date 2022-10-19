const { StatusCodes } = require("http-status-codes");
const client = require("../client/client");
const { v4: uuidv4 } = require("uuid");

class TaskController {
  // Show all tasks
  static async getAll(request, response) {
    client.getAll(null, (err, data) => {
      if (!err) {
        const taskList = data.tasks;
        return response
          .status(StatusCodes.OK)
          .render("tasks/list", { taskList });
      }
    });
  }

  // Task create page
  static createTaskView(request, response) {
    return response.status(StatusCodes.OK).render("tasks/create");
  }

  // Create a task
  static async createTask(request, response) {
    const { title, description } = request.body;
    const done = false;
    const id = uuidv4();
    const newTask = { id, title, description, done };

    client.insert(newTask, (err, data) => {
      if (err) throw err;
      console.log("Food created successfully: ", data);
    });

    return response.status(StatusCodes.CREATED).redirect("/tasks/list");
  }

  // Delete a task
  static async deleteTask(request, response) {
    const { id } = request.params;

    client.remove({ id: id }, (err, _) => {
      if (err) throw err;
      console.log("Customer removed successfully");
    });

    return response.status(StatusCodes.OK).redirect("/tasks/list");
  }
}

module.exports = TaskController;
