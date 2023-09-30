const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./users");

const app = express.Router();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("first connection with server");

  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser(socket.id, name, room);

    if (error) {
      return callback(error);
    } else {
      callback(error);
    }
    console.log("do we visit here");
    socket.join(user.room);

    socket.on("onchatRoom", () => {
      console.log("we are on chatroom");
      socket.emit("message", {
        user: "admin",
        text: `welcome to the room ${user.name}`,
        timestamp: new Date().toISOString(),
      });

      socket.to(user.room).emit("message", {
        user: "admin",
        text: ` ${user.name} joined the room `,
        timestamp: new Date().toISOString(),
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log("sendmessage me hai ham", user, message);

    if (user) {
      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
        timestamp: new Date().toISOString(),
      });
    }
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      socket.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the chat`,
      });
      socket.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    console.log("User left");
  });
});

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
