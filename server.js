
//Requiring path
const path = require('path')

// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");

// Requiring chatroom as we've configured it
const passport = require("./config/passport");

//create socket instance
const socket = require("socket.io");
// Requiring http
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socket(server);


// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const botName = "Babble Chat";

//Run when client connects 
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

  //Welcome current user
  socket.emit("message", formatMessage(botName, "Welcome to Chatroom!"));

  //Broadcast when a user connects
  socket.broadcast
  .to(user.room)
  .emit("message", formatMessage(botName, `${user.username} has joined the chat`));

  //Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });

  });

  //Listen for chatMessage
  io.on("chatMessage", (msg) => {

    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));

  });


});

 //Run when client disconnects
 io.on("disconnect", () => {
   const user = userLeave(socket.id);

   if(user) {

    io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));

     //Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });

   }
});

// Creating express app and configuring middleware needed for authentication
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
