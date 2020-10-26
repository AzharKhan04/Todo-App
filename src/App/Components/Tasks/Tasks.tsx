import React, { useState, useEffect } from "react";
import TaskTable from "../TaskTable";
import { connect } from "react-redux";
import TaskService from "../../Services/TaskService";

interface TaskProps {
  AddTasks: Function;
  tasks: any;
}

const Tasks: React.FC<TaskProps> = (props) => {
  const [tasks, setTasks] = useState([]);

  const [tabs, setTabs] = useState([
    {
      label: "All Tasks",
      isActive: true,
      status: "None",
    },
    {
      label: "Compelted Tasks",
      isActive: false,
      status: "Done",
    },
    {
      label: "Pending Tasks",
      isActive: false,
      status: "Pending",
    },
  ]);

  useEffect(() => {
    getTasks();
  }, [tabs]);

  const getTasks = () => {
    const taskService = new TaskService();
    let tasks = taskService.getTasks();

    const activeTab = tabs.find((tab) => {
      return tab.isActive;
    });

    tasks = tasks.filter((task: any) => {
      if (activeTab.status === "None") {
        return task;
      }
      return task.status === activeTab.status;
    });

    let finalTasks = [
      {
        groupBy: "ALL",
        data: tasks,
      },
    ];

    console.log(finalTasks);

    setTasks(finalTasks);
    props.AddTasks(finalTasks);
  };

  const onTabChange = (tab: any) => {
    let newTabs = [...tabs];
    newTabs = newTabs.map((tabb: any) => {
      if (tabb.label === tab.label) {
        tabb.isActive = true;
      } else {
        tabb.isActive = false;
      }
      return tabb;
    });

    setTabs(newTabs);
  };

  return (
    <React.Fragment>
      <ul className="nav nav-tabs">
        {tabs.map((tab) => {
          let className = tab.isActive ? "nav-link active" : "nav-link";
          return (
            <li onClick={() => onTabChange(tab)} className="nav-item">
              <a className={className}>{tab.label}</a>
            </li>
          );
        })}
      </ul>

      <div className="row">
        <div className="col col-md-12">
          <TaskTable rows={props.tasks} onTaskUpdated={getTasks}></TaskTable>
        </div>
      </div>
    </React.Fragment>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
