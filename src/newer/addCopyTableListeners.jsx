/* Create HTML string of body that only includes selected cells (based on selected rows & columns) */
const createBodyText = (body, checkedColumns, allRowState) => {
  // BR stands for "Body Row"
  // SBR stands for "Selected BR"

  // Get array of SBRs
  let allSBR = [];
  const allBR = body.getElementsByClassName("rt-tr");
  if (allRowState === 2) {
    // If some row selected
    // For each row, check if row's checkbox is checked
    // Only add to array of selected rows if row's checkbox is checked
    let brIndex;
    for (brIndex = 0; brIndex < allBR.length; brIndex += 1) {
      if (allBR[brIndex].getElementsByTagName("input")[0].checked) {
        allSBR.push(allBR[brIndex]);
      }
    }
  } else {
    // If all rows selected
    // Add all rows to array of selected rows
    allSBR = allBR;
  }

  // For each SBR
  // Create a BR string
  // Concatenate all BR strings to bodyText
  let bodyText = ""; // string of body's HTML
  let sbrIndex;
  for (sbrIndex = 0; sbrIndex < allSBR.length; sbrIndex += 1) {
    // For each SBR cell
    // Check if cell is in a selected column
    // If in a selected column, add content to brText
    let brText = ""; // string of current BR's HTML
    const allBRCells = allSBR[sbrIndex].getElementsByClassName("rt-td");
    let brCellIndex;
    for (
      brCellIndex = 0;
      brCellIndex < checkedColumns.length;
      brCellIndex += 1
    ) {
      brText += `<td>${allBRCells[checkedColumns[brCellIndex]].innerHTML}</td>`;
    }
    bodyText += `<tr>${brText}</tr>`;
  }
  bodyText = `<tbody>${bodyText}</tbody>`;
  return bodyText;
};

/* Create HTML string of header row that only includes selected columns */
const createHeaderText = (header, checkedColumns) => {
  // HC stands or "Header Cell"

  // For each header
  // Check if column selected
  // If selected, add its content to hText
  let hText = ""; // string of header's HTML
  let hIndex;
  const allHC = header.getElementsByClassName("rt-resizable-header-content");
  for (hIndex = 0; hIndex < checkedColumns.length; hIndex += 1) {
    hText += `<th>${allHC[checkedColumns[hIndex]].innerHTML}</th>`;
  }
  hText = `<thead><tr>${hText}</tr></thead>`;
  return hText;
};

/* Create array of indexes of selected columns */
const getSelectedColumns = (columnCheckboxRow, allColumnState) => {
  // CC stands for "Column Checkbox"

  // Get all CCs
  const allCC = columnCheckboxRow.getElementsByTagName("input");

  // Push index of selected columns to array
  // Skip index 0 (allColumnCheckbox)
  const selectedCC = [];
  let ccIndex;
  if (allColumnState === 1) {
    // If all columns selected
    // Push all columns (no checking required)
    for (ccIndex = 1; ccIndex < allCC.length; ccIndex += 1)
      selectedCC.push(ccIndex);
  } else {
    // If some columns selected
    // For each column, check if column's checkbox is checked
    // Only add to array of selected columns if columns's checkbox is checked
    for (ccIndex = 1; ccIndex < allCC.length; ccIndex += 1) {
      if (allCC[ccIndex].checked) {
        selectedCC.push(ccIndex);
      }
    }
  }

  return selectedCC;
};

/* Create HTML string of selected cells (based on selected rows and columns) */
const createTableText = (table, allRowState, allColumnState, style) => {
  const columnCheckboxRow = table.getElementsByClassName("rt-thead")[0];
  const tableHeaders = table.getElementsByClassName("rt-thead")[1];
  const tableBody = table.getElementsByClassName("rt-tbody")[0];

  // Get array of selcted columns
  const selectedCC = getSelectedColumns(columnCheckboxRow, allColumnState);

  // create HTML string of table
  const headerText = createHeaderText(tableHeaders, selectedCC);
  const bodyText = createBodyText(tableBody, selectedCC, allRowState);
  // GOAL : X manually assign style
  const tableText = `${style}<table>${headerText}${bodyText}</table>`;
  return tableText;
};

/* Return state of checkbox */
const getCheckboxState = checkbox => {
  // 0 = unchecked: none selected
  // 1 = checked: all selected
  // 2 = indeterminate: some selected
  let checkboxState = 0;
  if (checkbox.checked) checkboxState = 1;
  else if (checkbox.indeterminate) checkboxState = 2;
  return checkboxState;
};

const addCopyTableListeners = (tableList, pasteStyle) => {
  // Create intermediary clipboard --> real clipboard is clipboardData
  const clipboard = {
    data: "",
    intercept: false, // decides if should run hook
    hook(evt) {
      if (clipboard.intercept) {
        evt.preventDefault(); // prevents copying highlighted section into clipboard
        evt.clipboardData.setData("text/html", clipboard.data);

        // reset when done
        clipboard.intercept = false;
        clipboard.data = "";
      }
    }
  };

  const copyToClipboard = tableText => {
    clipboard.data = tableText;
    clipboard.intercept = true; // ensure hook can only run after copied
    document.execCommand("copy"); // trigger copy event to hook data to clipboard
  };

  const executeCopy = table => {
    // allColumnCheckbox: checkbox that selects/deselects all column checkboxes
    // allRowCheckbox: checkbox that selects/deselects all row checkboxes
    const allColumnCheckbox = table.getElementsByClassName("checkbox")[0];
    const allRowCheckbox = document
      .getElementsByClassName("rt-thead -header")[0]
      .getElementsByClassName("checkbox")[0];

    // Only run if there are both rows & columns selected
    // Get state of allRowCheckbox & allColumnState (checked, unchecked, indeterminate)
    const allColumnState = getCheckboxState(allColumnCheckbox);
    const allRowState = getCheckboxState(allRowCheckbox);

    if (
      (allRowState === 1 || allRowState === 2) &&
      (allColumnState === 1 || allColumnState === 2)
    ) {
      // Create string of table to copy
      const tableText = createTableText(
        table,
        allRowState,
        allColumnState,
        pasteStyle
      );

      // Copy string to clipboard
      copyToClipboard(tableText);
    }
  };

  // Add event listeners
  let i;
  for (i = 0; i < tableList.length; i += 1) {
    const t = i;
    const table = document.getElementById(tableList[t]);
    const btn = table.getElementsByTagName("button")[0];

    btn.addEventListener("click", () => {
      executeCopy(table);
    });
    table.addEventListener("copy", () => {
      if (document.activeElement.tagName !== "BUTTON") {
        // does not run if copy event listener triggered when button is clicked
        // only runs when Command-C is used
        executeCopy(table);
      }
    });
  }

  window.addEventListener("copy", clipboard.hook);
};

export default addCopyTableListeners;
