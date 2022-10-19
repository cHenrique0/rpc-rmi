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

  // Get one task
  static async getOne(request, response) {
    const { id } = request.params;
    client.get({ id: id }, (err, data) => {
      if (err) throw err;
      return response.status(StatusCodes.OK).json(data);
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
      console.log("Task created successfully: ", data);
    });

    return response.status(StatusCodes.CREATED).redirect("/tasks/list");
  }

  // Delete a task
  static async deleteTask(request, response) {
    const { id } = request.params;

    client.remove({ id: id }, (err, _) => {
      if (err) throw err;
      console.log("Task removed successfully");
    });

    return response.status(StatusCodes.OK).redirect("/tasks/list");
  }

  // Task update page
  static async updateTaskView(request, response) {
    const { id } = request.params;
    // TODO: get the task by id
    client.get({ id: id }, (err, data) => {
      if (err) throw err;
      const task = data;
      return response.status(StatusCodes.OK).render("tasks/edit", { task });
    });
  }

  // Update a task
  static async updateTask(request, response) {
    const { id } = request.params;
    const { title, description } = request.body;
    const updatedTask = { id, title, description };

    client.update(updatedTask, (err, data) => {
      if (err) throw err;
      console.log("Task updated successfully: ", data);
    });

    return response.status(StatusCodes.OK).redirect("/tasks/list");
  }

  // Done task
  static async doneTask(request, response) {
    const { id } = request.params;

    client.get({ id: id }, (err, data) => {
      if (err) throw err;
      let task = data;

      client.done(task, (err, data) => {
        if (err) throw err;
        console.log("Done task successfully: ", data);
      });
    });

    return response.status(StatusCodes.OK).redirect("/tasks/list");
  }
}

module.exports = TaskController;
