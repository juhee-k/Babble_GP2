const express = require("express");
const app = express();
const path = require('path')
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8080;
const session = require("express-session");
const passport = require("./config/passport");


// Setting up port and requiring models for syncing
const db = require("./models");

var numUsers = 0;


const botName = "Babble Chat";

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
app.get("/" ,((req, res) => {
  res.sendFile(path.join(__dirname, "public/members.html"))
})
)
// Creating express app and configuring middleware needed for authentication
io.on('connection', (socket) => {
  var addedUser = false;
  console.log("socket connected!")
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on("test msg", msg => console.log(msg))

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
// db.sequelize.sync({force:false}).then(() => {
  server.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );

    // I don't think this line below is in the correct place... -Alex //
  });
  //socket io hooks

// });
// Syncing our database and logging a message to the user upon success




