import React, { useState } from "react";
import Modal from "../../UIComponents/Modal";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskService from "../../Services/TaskService";
import AddEditTaskPropTypes from "./AddEditTaskPropTypes";

const AddEditTask: React.FC<AddEditTaskPropTypes> = (props) => {
  const initialData: any = props.data;

  console.log(initialData);
  const initErrors: any = {};

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(initErrors);

  const validateTitle = (val: string) => {
    if (!val || val.length < 10 || val.length > 140) {
      let newErrors = { ...errors };
      newErrors["title"] =
        "Task Title should be atleast 10 characters and not more than 140 characters";
      setErrors(newErrors);
      return false;
    } else {
      let newErros = { ...errors };
      newErros["title"] = null;
      setErrors(newErros);
      return true;
    }
  };

  const validateDescription = (val: string) => {
    if (!val || val.length < 10 || val.length > 150) {
      let newErrors = { ...errors };

      console.log(newErrors);
      newErrors["description"] =
        "Task Description should be atleast 10 characters and not more than 500 characters";
      setErrors(newErrors);
      return false;
    } else {
      let newErros = { ...errors };
      newErros["description"] = null;

      setErrors(newErros);

      return true;
    }
  };

  const onChange = (evt: any) => {
    const val = evt.target.value;
    const key = evt.target.name;

    let newData = { ...data };
    newData[key] = val;
    setData(newData);

    if (key === "title") {
      validateTitle(val);
    } else if (key === "description") {
      validateDescription(val);
    }
  };

  const onChangeDueDate = (date: any) => {
    let newData = { ...data };
    newData["dueDate"] = new Date(date).getTime();
    setData(newData);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    if (!validateDescription(data.description)) {
      return;
    } else if (!validateTitle(data.title)) {
      return;
    }

    let sendData = { ...data };

    sendData["dueDate"] = sendData.dueDate.toString();

    let taskService = new TaskService();

    if (!data.id) {
      sendData["id"] = new Date().getTime();
      sendData["created"] = new Date().getTime().toString();
      sendData["status"] = "Pending";
      taskService.addTask(sendData);

      let tasks = [...props.tasks];

      let allTasks = [];

      tasks.forEach((t: any) => {
        t.data.forEach((task: any) => {
          allTasks.push(task);
        });
      });

      allTasks.push(sendData);

      const newData = [
        {
          groupBy: "All",
          data: allTasks,
        },
      ];

      console.log(newData);

      props.AddTasks(newData);
    } else {
      taskService.updateTask(sendData);

      let tasks = [...props.tasks];

      tasks = tasks.map((task: any) => {
        task.data = task.data.map((t: any) => {
          if (t.id === data.id) {
            return data;
          }
          return t;
        });
        return task;
      });

      props.AddTasks(tasks);
    }

    props.onTaskSaved();
  };

  const onCloseTask = () => {
    props.onClose();
  };

  let selectedDueDate = data.dueDate
    ? new Date(parseInt(data.dueDate))
    : new Date();

  return (
    <React.Fragment>
      <Modal>
        <div className="row">
          <div className="col col-md-12">
            <h4>{props.title}</h4>
          </div>
        </div>
        <hr />
        <form onSubmit={onSubmit} style={{ width: "500px" }}>
          <div className="form-row">
            <div className="col col-md-12">
              <label>Task Summary</label>
              <input
                disabled={props.viewMode}
                name="title"
                onChange={onChange}
                value={data.title}
                type="text"
                className="form-control"
                placeholder="Task Summary..."
              />
              {errors && errors.title && (
                <p className="form-error">{errors.title}</p>
              )}
            </div>
          </div>
          <br />
          <div className="form-row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Task Description</label>
                <textarea
                  readOnly={props.viewMode}
                  onChange={onChange}
                  placeholder={"Task Description"}
                  name="description"
                  value={data.description}
                  className="form-control"
                  rows={3}
                ></textarea>
                {errors && errors.description && (
                  <p className="form-error">{errors.description}</p>
                )}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-6">
              <label>Due Date</label>

              <div>
                <DatePicker
                  readOnly={props.viewMode}
                  selected={selectedDueDate}
                  onChange={(date: any) => onChangeDueDate(date)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Priority</label>
                <select
                  disabled={props.viewMode}
                  value={data.priority}
                  name="priority"
                  onChange={onChange}
                  className="form-control"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          </div>

          <br />

          <div className="form-row">
            <div className="col col-md-12 text-right">
              <Button
                onClick={onCloseTask}
                style={{ marginRight: "6px" }}
                variant="outlined"
              >
                Cancel
              </Button>
              {!props.viewMode && (
                <Button type="submit" variant="contained" color="primary">
                  {data.id ? "Update Task" : "Add Task"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </React.Fragment>
  );
};

AddEditTask.defaultProps = {
  data: {
    dueDate: new Date().getTime(),
    priority: "High",
  },
  title: "Add Task",
  viewMode: false,
};

const mapStateToProps = (state: any) => {
  return {
    tasks: state.app.tasks,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    AddTasks: (data: any) =>
      dispatch({
        type: "ADDTASKS",
        payload: data,
      }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddEditTask);
