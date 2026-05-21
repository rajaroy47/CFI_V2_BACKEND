const express = require('express');
const cors = require("cors");
const userRoutes = require("./routes/auth.routes.js");
const sessionRoutes = require("./routes/session.routes.js");
const serviceRoutes = require("./routes/service.routes.js");
const notificationRoutes = require("./routes/notification.routes.js");

const cookieParser = require("cookie-parser");


const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.send("This is Home Route");
})

app.use("/auth/api/v1", userRoutes);
app.use("/session/v1", sessionRoutes);
app.use("/service", serviceRoutes);
app.use("/notification", notificationRoutes);


module.exports = app;




