import React from "react";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

interface HeaderProps {
  onAddTask: Function;
}

const Header: React.FC<HeaderProps> = (props) => {
  const onAdd = () => {
    props.onAddTask();
  };
  return (
    <React.Fragment>
      <div className="row">
        <div className="col col-md-10">
          <Typography variant="h4">To Do App</Typography>
        </div>
        <div className="col col-md-2 text-right">
          <Fab onClick={onAdd} color="primary">
            <AddIcon />
          </Fab>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
