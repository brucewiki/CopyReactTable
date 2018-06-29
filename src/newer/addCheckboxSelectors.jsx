import React from "react";

/* ROW CHECKBOXES */

const toggleRow = rowIndex => {
  const newSelectedRows = Object.assign({}, this.state.selectedRows);
  newSelectedRows[rowIndex] = !this.state.selectedRows[rowIndex]; // if previously selected, then it should now be deselected, etc.
  this.setState({
    selectedRows: newSelectedRows,
    selectAllRows: 2 // indeterminate
  });
};

const toggleSelectAllRows = () => {
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
};

/* COLUMN CHECKBOXES */

const toggleColumns = headerIndex => {
  const newSelectedColumns = Object.assign({}, this.state.selectedColumns);
  newSelectedColumns[headerIndex] = !this.state.selectedColumns[headerIndex]; // if previously selected, then it should now be deselected, etc.
  this.setState({
    selectedColumns: newSelectedColumns,
    selectAllColumns: 2 // indeterminate
  });
};

const toggleSelectAllColumns = headerCheckboxRow => {
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
};

// find column index using cell's header name
const findColumnIndex = headerName => {
  const index = this.state.headers.findIndex(
    item => item.Header === headerName
  );
  return index + 1;
};

export const getColumns = () => {
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
            toggleSelectAllColumns(event.currentTarget.parentNode.parentNode);
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
              onChange={() => toggleSelectAllRows()}
            />
          ),
          Cell: props => (
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.selectedRows[props.index] === true} // checked = whether selectedRow is true
              onChange={() => {
                toggleRow(props.index);
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
            const headerIndex = Array.from(target.parentNode.children).indexOf(
              target
            );
            toggleColumns(headerIndex);
          }}
        />
      ),
      // columns: assign header name + accessor
      columns: [this.state.headers[c]]
    });
  }
  return columns;
};
