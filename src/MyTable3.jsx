import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import preloadData from "./data.json";

class MyTable extends Component {
  constructor(props) {
    super(props);

    /* INITIAL STATE:
    all row and column checkboxes unchecked
    AllRowCheckbox and AllColumnCheckbox unchecked
    load data and headers from source file
    */

    this.state = {
      selectedRows: {},
      selectAllRows: 0, // 0 = none, 1 = all, 2 = some (indeterminate)
      selectedColumns: {},
      selectAllColumns: 0, // 0 = none, 1 = all, 2 = some (indeterminate)
      data: preloadData.rowData,
      headers: preloadData.headers
    };
  }

  getColumns() {
    const columns = [
      // first object = first column
      {
        Header: () => (
          <input
            // allColumnCheckbox
            type="checkbox"
            className="checkbox"
            checked={this.state.selectAllColumns === 1}
            ref={input => {
              if (input) {
                input.indeterminate = this.state.selectAllColumns === 2; // indeterminate true when selectAllColumns == 2
              }
            }}
            onChange={event => {
              this.toggleSelectAllColumns(
                event.currentTarget.parentNode.parentNode
              );
            }}
          />
        ),
        // create column of row checkboxes
        columns: [
          {
            Header: () => (
              <input
                // allRowCheckbox
                type="checkbox"
                className="checkbox"
                checked={this.state.selectAllRows === 1}
                ref={input => {
                  if (input) {
                    input.indeterminate = this.state.selectAllRows === 2; // indeterminate when selectAllRows == 2
                  }
                }}
                // indeterminate={this.state.selectAllRows===2 ? true : undefined}
                onChange={() => this.toggleSelectAllRows()}
              />
            ),
            Cell: props => (
              <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selectedRows[props.index] === true} // checked = whether selectedRow is true
                onChange={() => {
                  this.toggleRow(props.index);
                }}
              />
            ),
            width: 45 // width size for column of checkboxes
          }
        ]
      }
    ];
    // for each header to be created
    let c;
    for (c = 0; c < this.state.headers.length; c += 1) {
      const i = c + 1;
      columns.push({
        // add to array "columns"
        // Header: create column checkbox for each header
        Header: () => (
          <input
            type="checkbox"
            className="checkbox"
            checked={this.state.selectedColumns[i] === true}
            onChange={input => {
              const target = input.currentTarget.parentNode;
              // get index of header using cell position in header row
              const headerIndex = Array.from(
                target.parentNode.children
              ).indexOf(target);
              this.toggleColumns(headerIndex);
            }}
          />
        ),
        // columns: assign header name + accessor
        columns: [this.state.headers[c]]
      });
    }
    return columns;
  }

  /* ROW CHECKBOXES */

  toggleRow(rowIndex) {
    const newSelectedRows = Object.assign({}, this.state.selectedRows);
    newSelectedRows[rowIndex] = !this.state.selectedRows[rowIndex]; // if previously selected, then it should now be deselected, etc.
    this.setState({
      selectedRows: newSelectedRows,
      selectAllRows: 2 // indeterminate
    });
  }

  toggleSelectAllRows() {
    const newSelectedRows = {};
    if (this.state.selectAllRows === 0) {
      // if none selected
      // set all as selected
      let i;
      for (i = 0; i < this.state.data.length; i += 1) {
        newSelectedRows[i] = true;
      }
    }
    // if all selected --> set selectedColumns as {} (none)

    this.setState({
      selectedRows: newSelectedRows,
      selectAllRows: this.state.selectAllRows === 0 ? 1 : 0
    });
  }

  /* COLUMN CHECKBOXES */

  toggleColumns(headerIndex) {
    const newSelectedColumns = Object.assign({}, this.state.selectedColumns);
    newSelectedColumns[headerIndex] = !this.state.selectedColumns[headerIndex]; // if previously selected, then it should now be deselected, etc.
    this.setState({
      selectedColumns: newSelectedColumns,
      selectAllColumns: 2 // indeterminate
    });
  }

  toggleSelectAllColumns(headerCheckboxRow) {
    const newSelectedColumns = {};
    if (this.state.selectAllColumns === 0) {
      // if none selected
      const allHeaders = headerCheckboxRow.getElementsByClassName("rt-th");
      let i;
      for (i = 1; i < allHeaders.length; i += 1) {
        newSelectedColumns[i] = true;
      }
    }
    // if all selected --> set selectedColumns as {} (none)
    this.setState({
      selectedColumns: newSelectedColumns,
      selectAllColumns: this.state.selectAllColumns === 0 ? 1 : 0
    });
  }

  // find column index using cell's header name
  findColumnIndex(headerName) {
    const index = this.state.headers.findIndex(
      item => item.Header === headerName
    );
    return index + 1;
  }

  render() {
    return (
      <div id="myTable3">
        <h1>Table 3</h1>
        <button>
          Copy Selected Cells
        </button>
        <br /><br />
        <ReactTable
          data={this.state.data}
          columns={this.getColumns()}
          defaultPageSize={10}
          pageSizeOptions={[
            10,
            50,
            100,
            500,
            1000,
            2500,
            5000,
            10000,
            15000,
            20000
          ]}
          className="-stiped -highlight"
          getTdProps={(state, rowInfo, column) => {
            const rowIndex = rowInfo.index;
            const columnIndex = this.findColumnIndex(column.Header);

            const rowChecked = this.state.selectedRows[rowIndex];
            const columnChecked = this.state.selectedColumns[columnIndex];

            return {
              style: {
                background: rowChecked && columnChecked && columnIndex !== 0
                  ? "lightgreen" // set colour for selected
                  : "" // set colour for unselected
              },
              onClick: () => {
                if (columnIndex !== 0) {
                  if (rowChecked && columnChecked) {
                    // selected
                    this.toggleRow(rowIndex);
                    this.toggleColumns(columnIndex);
                  } else {
                    // not selected
                    if (!rowChecked) {
                      this.toggleRow(rowIndex);
                    }
                    if (!columnChecked) {
                      this.toggleColumns(columnIndex);
                    }
                  }
                }
              }
            };
          }}
        />
      </div>
    );
  }
}

export default MyTable;
