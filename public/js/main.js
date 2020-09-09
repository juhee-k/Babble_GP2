$(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    const socket = io.connect();
    let userData = null;
    $.get("/api/user_data").then(data => {
        userData = data;
      $(".member-name").text(data?.email);
    });
      
    socket.emit("test msg", `${userData?.email} has logging in!`)
  });


