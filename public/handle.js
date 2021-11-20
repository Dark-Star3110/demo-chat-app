const serverPORT = "http://localhost:3000";

var socket = io(serverPORT);

socket.on("server-send-login-fail", (err) => alert(err));

socket.on("server-send-login-success", (username) => {
  $("#currentUser").html(username);
  $(".login-form").hide(2000);
  $(".chat-form").show(1000);
});

socket.on("server-send-list-user", (listUser) => {
  $(".box-content").html("");
  listUser.forEach((user) => {
    $(".box-content").append(`<div class="useronline">${user}</div>`);
  });
});

socket.on("server-send-message", (data) => {
  const { user, message } = data;
  $(".listMessages").append(
    `<div class="mes-content"><span style="color:yellow;font-weight:bold;">${user}</span> : <span>${message}</span></div>`
  );
});

socket.on("server-noti-input", (noti) => {
  if (noti) {
    $("#noti").html(noti);
  }
});

socket.on("server-noti-stop-input", () => {
  $("#noti").html("");
});

$(document).ready(function () {
  $(".login-form").show();
  $(".chat-form").hide();

  $("#regis-btn").click(function () {
    socket.emit("client-send-username", $("#username").val());
  });

  $("#logout-btn").click(function () {
    socket.emit("logout");
    $(".chat-form").hide(2000);
    $(".login-form").show(1000);
  });

  $("#send-btn").click(function () {
    const value = $("#text-message").val();
    if (value) {
      socket.emit("client-send-message", value);
      $("#text-message").val("");
    }
  });

  $("#text-message").focusin(function () {
    socket.emit("user-enter-input");
  });

  $("#text-message").focusout(function () {
    socket.emit("user-stop-input");
  });
});
