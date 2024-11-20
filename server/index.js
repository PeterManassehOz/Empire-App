/*import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import cors from "cors";
import UploadRoute from "./Routes/UploadRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";

// Routes


const app = express();

// To serve images for public
app.use(express.static('public'));
app.use('/images', express.static('images'));


// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({origin: 'http://localhost:3000'}));

dotenv.config()

mongoose.connect(process.env.MONGO_DB).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});

//usage of routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)

//app.get('/', (req, res) => {
//    res.send('Hello World!');
//})
*/

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import cors from "cors";
import UploadRoute from "./Routes/UploadRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import http from "http";  // Import http to work with socket.io
import socketIo from "socket.io";  // Import socket.io

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL,  // Use environment variable for frontend URL
        methods: ["GET", "POST"]
    }
});

let activeUsers = [];

io.on("connection", (socket) => {
    // Add a new user
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            });
        }
        console.log('Connected Users', activeUsers);
        io.emit("get-users", activeUsers);
    });

    // Send message
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit("receive-message", data);
        }
    });

    // Remove user when disconnected
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log('User Disconnected', activeUsers);
        io.emit("get-users", activeUsers);
    });
});

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));

// MongoDB connection
mongoose.connect(process.env.MONGO_DB).then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}).catch((error) => {
    console.log(error);
});

// Usage of routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);

// Optionally, you can add a basic route for testing
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
