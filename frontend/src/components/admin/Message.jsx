import React, { useState } from "react";
import "./Message.css";

const App = () => {
  // Dữ liệu mẫu cho người dùng
  const users = [
    { id: 1, name: "Alice", avatar: "https://via.placeholder.com/50" },
    { id: 2, name: "Bob", avatar: "https://via.placeholder.com/50" },
    { id: 3, name: "Charlie", avatar: "https://via.placeholder.com/50" },
  ];

  // Dữ liệu mẫu cho tin nhắn (theo userId)
  const messagesData = {
    1: [
      { id: 1, text: "Hello Alice!", sender: "me" },
      { id: 2, text: "Hi there!", sender: "Alice" },
      { id: 3, text: "How are you?", sender: "me" },
    ],
    2: [
      { id: 1, text: "Hey Bob!", sender: "me" },
      { id: 2, text: "What's up?", sender: "Bob" },
    ],
    3: [
      { id: 1, text: "Charlie, are you free?", sender: "me" },
      { id: 2, text: "Yes, let's chat!", sender: "Charlie" },
    ],
  };

  const [selectedUser, setSelectedUser] = useState(users[0]); // Người dùng mặc định
  const [messages, setMessages] = useState(messagesData[selectedUser.id] || []);
  const [newMessage, setNewMessage] = useState("");

  // Hàm chọn người dùng
  const selectUser = (user) => {
    setSelectedUser(user);
    setMessages(messagesData[user.id] || []);
  };

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: "me",
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
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
              className={selectedUser.id === user.id ? "active" : ""}
              onClick={() => selectUser(user)}
            >
              <img src={user.avatar} alt={user.name} />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="main">
        <div className="mess-content-header">
          <h3>Chat with {selectedUser.name}</h3>
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
