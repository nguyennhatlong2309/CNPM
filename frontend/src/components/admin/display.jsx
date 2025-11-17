import React from "react";
import "./display.css";
import Sidebar from "./sidebar";
import Tongquan from "./Tongquan";
import BusManagement from "./Bus";
import DriverManagement from "./Driver";
import Student from "./Student";
import Route from "./Route";

const Header = ({ title }) => {
  return (
    <header style={{ border: "solid 1px black" }}>
      <h1>{title}</h1>
      <div className="user-info">
        <span role="img" aria-label="notification" className="icon-bell">
          🔔
        </span>
        <div className="avatar"></div>
        <span className="username">Nguyễn Văn A</span>
      </div>
    </header>
  );
};
const display = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header title={"Quan ly hoc sinh"} />
        <Route />
      </div>
    </div>
  );
};
export default display;
