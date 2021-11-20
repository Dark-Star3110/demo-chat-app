const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const port = process.env.PORT || 3000;

var io = require("socket.io")(server);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));

let users = [];

io.on("connection", (socket) => {
  console.log("a user is connected " + socket.id);

  socket.on("client-send-username", (username) => {
    if (users.indexOf(username) >= 0) {
      // fail
      socket.emit("server-send-login-fail", "username already in use");
    } else {
      // success
      users.push(username);
      socket["username"] = username;
      socket.emit("server-send-login-success", username);
      io.sockets.emit("server-send-list-user", users);
    }
  });

  socket.on("logout", function () {
    users.splice(users.indexOf(socket.username), 1);
    socket.broadcast.emit("server-send-list-user", users);
  });

  socket.on("client-send-message", (message) => {
    io.sockets.emit("server-send-message", {
      user: socket.username,
      message: message,
    });
  });

  socket.on("user-enter-input", () => {
    // console.log("co nguoi dang nhap");
    const noti = socket.username + " đang nhập";
    socket.broadcast.emit("server-noti-input", noti);
  });

  socket.on("user-stop-input", () => {
    io.sockets.emit("server-noti-stop-input");
  });
});

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
