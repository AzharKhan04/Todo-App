import React, { useState, useEffect } from "react";
import Header from "../Header";
import Filter from "../Filter";
import Tasks from "../Tasks";
import AddEditTask from "../AddEditTask";
import { connect } from "react-redux";
import TaskService from "../../Services/TaskService";
import groupBy from "lodash/groupBy";

interface DashboardProps {
  tasks: any;
  AddTasks: Function;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [modal, setModal] = useState(false);

  const onAddTask = () => {
    setModal(true);
  };

  const onTaskSaved = () => {
    setModal(false);
  };

  const onClose = () => {
    setModal(false);
  };

  const onFilter = (val: any) => {
    const taskService = new TaskService();
    const allTasks = taskService.getTasks();

    if (!val) {
      props.AddTasks([
        {
          groupBy: "ALL",
          data: allTasks,
        },
      ]);
    } else {
      const tasks = allTasks.filter((task: any) => {
        return task.title.includes(val);
      });

      props.AddTasks([
        {
          groupBy: "ALL",
          data: tasks,
        },
      ]);
    }
  };

  const onGroup = (groupByKey: any) => {
    const taskService = new TaskService();
    const allTasks = taskService.getTasks();

    const grouped = groupBy(allTasks, groupByKey);

    let newTasks: any = [];

    Object.keys(grouped).forEach((t: any, index: number) => {
      let groupBylabel = t;

      if (groupByKey == "created") {
        let month = new Date(parseInt(t)).getMonth() + 1;
        let day = new Date(parseInt(t)).getDate();
        let year = new Date(parseInt(t)).getFullYear();
        groupBylabel = `${day}-${month}-${year}`;
      }

      newTasks.push({
        groupBy: groupBylabel,
        data: grouped[t],
      });
    });

    props.AddTasks(newTasks);
  };
  return (
    <React.Fragment>
      {modal && (
        <AddEditTask onTaskSaved={onTaskSaved} onClose={onClose}></AddEditTask>
      )}

      <div className="row">
        <div className="col col-md-1"></div>
        <div className="col col-md-10">
          <Header onAddTask={onAddTask}></Header>
          <Filter onGroup={onGroup} onFilter={onFilter}></Filter>
          <Tasks></Tasks>
        </div>
        <div className="col col-md-1"></div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
