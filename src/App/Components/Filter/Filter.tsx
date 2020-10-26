import React from "react";

interface FilterProps {
  onFilter: Function;
  onGroup: Function;
}

const Filter: React.FC<FilterProps> = (props) => {
  const onSearch = (evt: any) => {
    const val = evt.target.value;
    props.onFilter(val);
  };

  const onGroup = (evt: any) => {
    const val = evt.target.value;
    props.onGroup(val);
  };
  return (
    <React.Fragment>
      <div className="row">
        <div className="col col-md-2">
          <div className="form-group">
            <label>Group By</label>
            <select className="form-control" onChange={onGroup}>
              <option value="none">None</option>
              <option value="created">Created</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
        <div className="col col-md-10">
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              onChange={onSearch}
              className="form-control"
              placeholder="Search Tasks"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Filter;
