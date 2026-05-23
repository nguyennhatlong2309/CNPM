import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Message.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user")
      .then((res) => {
        const fetchedUsers = res.data.map((u) => ({
          id: u.user_id,
          name: u.name || "User " + u.user_id,
          avatar: u.url_img || "https://via.placeholder.com/50",
        }));
        setUsers(fetchedUsers);
        if (fetchedUsers.length > 0) {
          selectUser(fetchedUsers[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const selectUser = (user) => {
    setSelectedUser(user);
    axios
      .get("http://localhost:5000/api/message")
      .then((res) => {
        const userMessages = res.data
          .filter((m) => m.user_id === user.id || m.sender_id === user.id)
          .map((m) => ({
            id: m.mess_id,
            text: m.content,
            sender: m.sender_id === 1 ? "me" : user.name,
          }));
        setMessages(userMessages);
      })
      .catch((err) => console.error(err));
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        sender_id: 1, // assuming admin is 1
        content: newMessage,
        sent_at: new Date().toISOString(),
        is_read: 0,
      };
      axios
        .post("http://localhost:5000/api/message", payload)
        .then((res) => {
          const newMsg = {
            id: res.data.id || messages.length + 1,
            text: newMessage,
            sender: "me",
          };
          setMessages([...messages, newMsg]);
          setNewMessage("");
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="app">
      <div className="mess-sidebar">
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={selectedUser?.id === user.id ? "active" : ""}
              onClick={() => selectUser(user)}
            >
              <img src={user.avatar} alt={user.name} />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-main">
        <div className="mess-content-header">
          <h3>Chat with {selectedUser ? selectedUser.name : ""}</h3>
        </div>
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "me" ? "me" : "other"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
