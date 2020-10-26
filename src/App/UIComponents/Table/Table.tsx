import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

interface TableProps {
  rows: any;
  cols: Array<any>;
  onSort?: Function;
  onRowClick?: Function;
}

const UITable: React.FC<TableProps> = (props) => {
  const onSort = (col: any) => {
    if (props.onSort) {
      props.onSort(col.colName, col.orderBy);
    }
  };

  const getCol = (col: any) => {
    return (
      <div className="row">
        {col.sortable && (
          <div className="col col-md-12">
            <span onClick={() => onSort(col)}>{col.name}</span>

            {col.orderBy === "asc" && (
              <IconButton onClick={() => onSort(col)} size="small">
                <ArrowDownwardIcon fontSize="inherit" />
              </IconButton>
            )}
            {col.orderBy === "desc" && (
              <IconButton onClick={() => onSort(col)} size="small">
                <ArrowUpwardIcon fontSize="inherit" />
              </IconButton>
            )}
          </div>
        )}
        {!col.sortable && <div className="col col-md-12">{col.name}</div>}
      </div>
    );
  };

  const onRowClick = (data: any, col: any) => {
    if (col.colName === "actions") {
      return;
    }

    if (props.onRowClick) {
      props.onRowClick(data);
    }
  };


  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {props.cols.map((col: any) => {
                return <TableCell key={col.id}>{getCol(col)}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row: any, index: number) => (
              <React.Fragment>
                {row.groupBy !== "undefined" &&
                  row.groupBy &&
                  row.groupBy !== "All" &&
                  row.groupBy !== "ALL" && (
                    <div key={index} className="row text-center">
                      <div className="col col-md-12">
                        <strong>{row.groupBy}</strong>
                      </div>
                    </div>
                  )}
                {row.data.map((row: any, index: number) => {
                  return (
                    <TableRow style={{ cursor: "pointer" }} key={index}>
                      {props.cols.map((col: any) => {
                        return (
                          <TableCell
                            onClick={() => onRowClick(row, col)}
                            key={col.id}
                            component="th"
                            scope="row"
                          >
                            <div
                              style={{
                                maxWidth: "300px",
                                wordBreak: "break-all",
                              }}
                            >
                              {row[col.colName]}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

UITable.defaultProps = {
  rows: [],
  cols: [],
};

export default React.memo(UITable);
