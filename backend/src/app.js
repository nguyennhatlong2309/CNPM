const express = require("express");
const cors = require("cors"); // thêm cors
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Load routes
app.use("/api/bus", require("./routes/bus.route"));
app.use("/api/detailtrips", require("./routes/detailtrips.route"));
app.use("/api/drivers", require("./routes/drivers.route"));
app.use("/api/incidents", require("./routes/incidents.route"));
app.use("/api/message", require("./routes/message.route"));
app.use("/api/notification", require("./routes/notification.route"));
app.use(
  "/api/notificationtouser",
  require("./routes/notificationtouser.route")
);
app.use("/api/parent", require("./routes/parent.route"));
app.use("/api/point", require("./routes/pickupdropoffpoint.route"));
app.use("/api/route", require("./routes/route.route"));
app.use("/api/schoolyear", require("./routes/schoolyear.route"));
app.use("/api/student", require("./routes/student.route"));
app.use("/api/trip", require("./routes/trip.route"));
app.use("/api/user", require("./routes/user.route"));

module.exports = app;
