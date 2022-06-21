import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

export var pusher = new Pusher(process.env.PUSHER_KEY, {
  cluster: 'ap2'
});



// var channel = pusher.subscribe('my-channel');
// channel.bind('my-event', function(data) {
//   alert(JSON.stringify(data));
// });