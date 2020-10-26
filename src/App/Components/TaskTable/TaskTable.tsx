import React, { useState, useEffect } from "react";
import orderBy from "lodash/orderBy";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import UITable from "../../UIComponents/Table";
import AddEditTask from "../AddEditTask";
import Modal from "../../UIComponents/Modal";
import TaskService from "../../Services/TaskService";
import { connect } from "react-redux";

interface TaskTableProps {
  rows: any;
  tasks: any;
  AddTasks: Function;
  onTaskUpdated: Function;
}

const TaskTable: React.FC<TaskTableProps> = (props) => {
  const initCols = [
    {
      name: "Summary",
      colName: "title",
      id: 1,
      sortable: true,
    },
    {
      name: "Priority",
      colName: "priority",
      id: 2,
      sortable: true,
    },
    {
      name: "Created On",
      colName: "created",
      orderBy: "asc",
      id: 3,
      sortable: true,
    },
    {
      name: "Due By",
      colName: "dueDate",
      id: 4,
      sortable: true,
    },
    {
      name: "Actions",
      colName: "actions",
    },
  ];

  const [cols, setCols] = useState(initCols);
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);

  const [filterQuery, setFilterQuery] = useState({
    orderBy: "created",
    orderType: "desc",
  });

  useEffect(() => {
    setupData();
  }, [props, filterQuery]);

  const getDateString = (timestamp: any) => {
    const date = new Date(parseInt(timestamp));
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} `;
  };

  const onEdit = (evt: any, data: any) => {
    let newData = {
      data: data,
      type: "EDITTASK",
    };

    setModal(newData);
  };

  const onDelete = (evt: any, data: any) => {
    let newData = {
      data: data,
      type: "DELETETASK",
    };

    setModal(newData);
  };

  const onDeleteTask = (data: any) => {
    const taskService = new TaskService();
    taskService.deleteTask(data);

    let tasks = [...props.tasks];

    tasks = tasks.map((task: any) => {
      task.data = task.data.filter((t: any) => {
        return t.id !== data.id;
      });
      return task;
    });

    console.log(tasks);

    props.AddTasks(tasks);

    setModal(null);
  };

  const deletTask = () => {
    return (
      <Modal>
        <div className="row">
          <div className="col col-md-12 text-center">
            <p>{`Are you sure want to delete the task ?`}</p>
            <p style={{ maxWidth: "240px", wordBreak: "break-all" }}>
              <strong>{modal.data.title}</strong>
            </p>
          </div>
        </div>
        <div className="row text-center">
          <div className="col col-md-6">
            <Button
              onClick={() => onDeleteTask(modal.data)}
              style={{ minWidth: "100px" }}
              variant="outlined"
              color="secondary"
            >
              {"Delete"}
            </Button>
          </div>
          <div className="col col-md-6">
            <Button
              onClick={() => setModal(null)}
              style={{ minWidth: "100px" }}
              variant="outlined"
              color="default"
            >
              {"Cancel"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const updateStatus = (data: any) => {
    console.log(data);

    const taskService = new TaskService();

    const newData = { ...data };

    if (newData.status === "Pending") {
      newData.status = "Done";
    } else {
      newData.status = "Pending";
    }

    taskService.updateTask(newData);

    let tasks = [...props.tasks];

    tasks = tasks.map((task: any) => {
      task.data = task.data.map((t: any) => {
        if (t.id === data.id) {
          return newData;
        }
        return t;
      });
    });

    props.AddTasks(tasks);
    props.onTaskUpdated();
  };

  const onTaskSaved = () => {
    setModal(null);
  };

  const getActions = (data: any) => {
    let color = data.status === "Pending" ? "green" : null;
    let actionLabel = data.status === "Pending" ? "Done" : "Re-Open";

    return (
      <div className="row">
        <div className="col col-md-2">
          <IconButton
            onClick={(evt) => onEdit(evt, data)}
            color="primary"
            aria-label="delete"
          >
            <EditIcon />
          </IconButton>
        </div>

        <div className="col col-md-3">
          <IconButton
            onClick={(evt) => onDelete(evt, data)}
            color="secondary"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </div>

        <div className="col col-md-4">
          <Button
            onClick={() => updateStatus(data)}
            style={{ minWidth: "100px", marginTop: "7px", color: color }}
            variant="outlined"
            color="primary"
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    );
  };

  const setupData = () => {
    const orderByKey = filterQuery.orderBy;
    const orderTypeKey = filterQuery.orderType;

    let newRowsData: any = [];
    props.rows.forEach((row: any, index: number) => {
      let sortedData: any = [];

      if (orderTypeKey === "desc") {
        sortedData = orderBy(row.data, [orderByKey], ["desc"]);
      } else {
        sortedData = orderBy(row.data, [orderByKey], ["asc"]);
      }

      let data = sortedData.map((r: any) => {
        let newData = {
          ...r,
          title:
            r.status === "Pending" ? (
              r.title
            ) : (
              <p
                style={{
                  padding: "12px",
                  color: "white",
                  backgroundColor: "green",
                }}
              >
                {r.title}
              </p>
            ),
          created: getDateString(r.created),
          dueDate: getDateString(r.dueDate),
          actions: getActions(r),
        };
        return newData;
      });

      newRowsData.push({
        groupBy: row.groupBy,
        data: data,
      });
    });

    setRows(newRowsData);
  };

  const onSort = (key: any, type: any) => {
    const newCols = cols.map((col) => {
      if (col.colName === key && col.orderBy) {
        col.orderBy = type === "asc" ? "desc" : "asc";
      } else if (col.colName === key && !col.orderBy) {
        col.orderBy = "asc";
      } else {
        col.orderBy = null;
      }

      return col;
    });

    setCols(newCols);
    let newFilterQuery = { ...filterQuery };
    newFilterQuery.orderBy = key;
    newFilterQuery.orderType = type === "asc" ? "desc" : "asc";
    setFilterQuery(newFilterQuery);
  };

  const viewTask = (data: any) => {
    let found = null;

    props.tasks.forEach((task: any) => {
      let f = task.data.find((d: any) => {
        return data.id == d.id;
      });
      if (f) {
        found = f;
      }
      return;
    });

    let newModal = { ...modal };
    newModal.type = "VIEWTASK";
    newModal.data = found;
    setModal(newModal);
  };

  return (
    <React.Fragment>
      {modal && modal.type === "EDITTASK" && (
        <AddEditTask
          title={"Edit Task"}
          data={modal.data}
          onTaskSaved={onTaskSaved}
          onClose={onTaskSaved}
        ></AddEditTask>
      )}
      {modal && modal.type === "VIEWTASK" && (
        <AddEditTask
          title={"View Task"}
          viewMode={true}
          data={modal.data}
          onClose={onTaskSaved}
        ></AddEditTask>
      )}
      {modal && modal.type === "DELETETASK" && deletTask()}
      <UITable rows={rows} cols={cols} onSort={onSort} onRowClick={viewTask} />
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
export default connect(mapStateToProps, mapDispatchToProps)(TaskTable);
