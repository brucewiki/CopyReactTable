import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import addCopyTableListeners from "./addCopyTableListeners";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();

// array of IDs of tables
const tableList = ["myTable1", "myTable2", "myTable3"];
// style how table will be pasted as
const pasteStyle = `<style>table {border-collapse: collapse;} table, td, th {border: 1px solid black;}</style>`;
addCopyTableListeners(tableList, pasteStyle);
