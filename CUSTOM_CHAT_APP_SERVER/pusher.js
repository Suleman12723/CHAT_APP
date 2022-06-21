const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "ap2",
    useTLS: true
  });

  module.exports =  pusher;

//   pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
//   });
  