# Chat App Server
## Node js  Chat App Server


This is a Node js  based Chat application server. The Chat App front-end in React Native is also given in this repository. 

This Project is created using express-generator

### Start Project

- Copy this repository
- To install the required Packages type in the terminal:
```sh
npm install 
```
#### Used [Pusher](https://pusher.com/docs/channels/server_api/overview/?ref=docs-index) for managing sockets (channels SERVER API)

### .env Variables

```sh
SECRET_KEY = (For Jwt Strategy and Cookie secret)
MONGO_URL = (Your MongoDB local url)
MONGO_LATER_URL = (Your MongoDB online (cluster) url)
PUSHER_APP_ID = (Your Pusher App ID given by PUSHER)
PUSHER_KEY = (Your Pusher KEY given by PUSHER)
PUSHER_SECRET = (Your Pusher SECRET given by PUSHER)
```

### To run

```sh
npm start
```

## Features

- REST API
- Mongoose Real time DB (using mongoose [changeStreams](https://mongoosejs.com/docs/change-streams.html))
- Login Route
- Register Route
- Private Chat (real-time ) Route
- Group Chat (real-time) Route
- Only admin can Add a new group member 
- Other Routes as well



## Tech

This chat app uses the following technologies

- [React Native] - (Front-end) hybrid mobile application development
- [React Native Elements] -(Front-end) for styled components
- [Node js] - (back-end)for server 



## License

MIT
