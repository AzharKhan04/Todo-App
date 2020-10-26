import TaskModel from "./TaskModel";

class Taskservice {
  tasks: Array<TaskModel> = [];
  constructor() {
    this.tasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
  }

  addTask(data: TaskModel) {
    if (!data) {
      return "No data provide to add task";
    }

    this.tasks.push(data);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getTasks() {
    return this.tasks;
  }

  deleteTask(data: any) {
    if (!data) {
      return;
    }

    this.tasks = this.tasks.filter((task: any) => {
      return task.id !== data.id;
    });

    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  updateTask(data: any) {
    if (!data) {
      return "No data provide to add task";
    }

    const updatedTasks = this.tasks.map((task: any) => {
      if (task.id === data.id) {
        return data;
      }
      return task;
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }
}

export default Taskservice;
