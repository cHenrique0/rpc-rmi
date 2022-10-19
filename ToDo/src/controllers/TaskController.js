const { StatusCodes } = require("http-status-codes");
const client = require("../client/client");

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
}

module.exports = TaskController;
