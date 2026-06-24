import http from "http";
import { Server } from "socket.io";

import app from "./App.js";
import { db } from "./config/db.js";
import chatRoutes from "./Api/Routes/chatRoutes.js";
import setupSocket from "./Api/Socket/Socket.js"

db();

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});