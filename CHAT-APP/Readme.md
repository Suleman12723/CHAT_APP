# Chat App
## React Native Chat Applicaton


This is a React Native (expo) based Chat application. The Chat App server in Node js is also given in this repository. 

### Start Project

- Copy this repository
- To install the required Packages type in the terminal:
```sh
npm install 
```
#### Used [Pusher](https://pusher.com/docs/channels/using_channels/client-api-overview/?ref=docs-index) for managing sockets

### .env Variables

```sh
PUSHER_KEY = (Replace this with your own Pusher Key)
```

### To run

```sh
npm start
```

## Features

- Login
- Register
- Private Chat (real-time )
- Group Chat (real-time)
- Can Take a Profile Photo through Camera ([expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/))
- Can also select Profile Photo from saved pictures in the device ([expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/))
- Upadte screen when added to a group or a private chat (real-time)
- Only admin can Add a new group member



## Tech

This chat app uses the following technologies

- [React Native] - hybrid mobile application development
- [React Native Elements] - for styled components
- [Node js] - for server



## License

MIT
