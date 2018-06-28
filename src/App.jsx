import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MyTable1 from "./MyTable1";
import MyTable2 from "./MyTable2";
import MyTable3 from "./MyTable3";

const App = () => (
  <div className="App" id="app">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <MyTable1 />
    <MyTable2 />
    <MyTable3 />
  </div>
);

export default App;
