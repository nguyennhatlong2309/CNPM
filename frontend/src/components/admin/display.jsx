import React, { useState, useEffect } from "react";
import "./display.css";
import Tongquan from "./Tongquan";
import Bus from "./Bus";
import Driver from "./Driver";
import Student from "./Student";
import Route from "./Route";
import Schedule from "./Schedule";
import Incident from "./Incident";
import Message from "./Message";
import MapShowPoint from "./MapShowPoint";
import Exam from "./zexam";

const Sidebar = ({ navigation }) => {
  const [activeMenu, setActiveMenu] = useState(1);

  return (
    <div className="sidebar">
      <div className="logo">
        <span>SSB 1.0</span>
      </div>
      <nav>
        <ul>
          <li
            id="1"
            className={activeMenu == 1 ? "active" : ""}
            onClick={() => {
              navigation(1);
              setActiveMenu(1);
            }}
          >
            <span role="img" aria-label="home">
              🏠
            </span>{" "}
            Tổng quan
          </li>
          <li
            id="2"
            className={activeMenu == 2 ? "active" : ""}
            onClick={() => {
              navigation(2);
              setActiveMenu(2);
            }}
          >
            <span role="img" aria-label="bus">
              🚌
            </span>{" "}
            Xe bus
          </li>
          <li
            id="3"
            className={activeMenu == 3 ? "active" : ""}
            onClick={() => {
              navigation(3);
              setActiveMenu(3);
            }}
          >
            <span role="img" aria-label="driver">
              🧍‍♂️
            </span>{" "}
            Tài xế
          </li>
          <li
            id="4"
            className={activeMenu == 4 ? "active" : ""}
            onClick={() => {
              navigation(4);
              setActiveMenu(4);
            }}
          >
            <span role="img" aria-label="student">
              🎓
            </span>{" "}
            Học sinh
          </li>
          <li
            id="5"
            className={activeMenu == 5 ? "active" : ""}
            onClick={() => {
              navigation(5);
              setActiveMenu(5);
            }}
          >
            <span role="img" aria-label="route">
              🛣️
            </span>{" "}
            Tuyến đường
          </li>
          <li
            id="6"
            className={activeMenu == 6 ? "active" : ""}
            onClick={() => {
              navigation(6);
              setActiveMenu(6);
            }}
          >
            <span role="img" aria-label="schedule">
              📅
            </span>{" "}
            Lịch trình
          </li>
          <li
            id="7"
            className={activeMenu == 7 ? "active" : ""}
            onClick={() => {
              navigation(7);
              setActiveMenu(7);
            }}
          >
            <span role="img" aria-label="incident">
              📋
            </span>{" "}
            Sự cố
          </li>
          <li
            id="8"
            className={activeMenu == 7 ? "active" : ""}
            onClick={() => {
              navigation(8);
              setActiveMenu(8);
            }}
          >
            <span role="img" aria-label="message">
              💬
            </span>{" "}
            Nhắn tin
          </li>
        </ul>
      </nav>
    </div>
  );
};

const Header = ({ title }) => {
  return (
    <header className="Header">
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

const Display = () => {
  let content;
  const [current_page, setCurrent_page] = useState(1);
  switch (current_page) {
    case 1:
      content = <Tongquan />;
      break;
    case 2:
      content = <Bus />;
      break;
    case 3:
      content = <Driver />;
      break;
    case 4:
      content = <Student />;
      break;
    case 5:
      content = <Route />;
      break;
    case 6:
      content = <Schedule />;
      break;
    case 7:
      content = <Incident />;
      break;
    case 8:
      content = <Message />;
      break;
    default:
      content = <Tongquan />;
  }
  return (
    <div className="dashboard-container">
      <Sidebar navigation={setCurrent_page} />
      <div className="main">
        <Header title={"Quan ly hoc sinh"} />
        {content}
      </div>
    </div>
  );
};
export default Display;
