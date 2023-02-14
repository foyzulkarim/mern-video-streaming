# MERN Video Streaming

Hello people, welcome to the repository. This is a real-world project that allows users to stream videos. It is also part of the [`Learn MERN in Bangla Like a pro`](https://youtube.com/playlist?list=PLEYpvDF6qy8ZUE9IyhYWrxt5zEyeXzwxq) playlist and you can learn and contribute to this repository.

## Architecture diagram

![alt text](https://drive.google.com/uc?export=view&id=1bZAX_UpwIsYPjaq92-usdPTElwOwDlbW)

## Technology used here

-   JavaScript -> As programming language
-   Node.js -> As javascript runtime
-   Express.js -> For handling request and response
-   MongoDB -> For storing persist data
-   React -> As UI library
-   MUI -> As component library
-   Socket.io -> For implementing websocket
-   ffmpeg -> For video processing
-   multer -> For uploading video in server
-   Redis -> For implementing pub/sub messaging system

## Installation and run the projects

-   To run this project, you need to install the following software:
    -  Node.js [`download link`](https://nodejs.org/en/download/)
    -  Docker [`installation instruction`](https://docs.docker.com/engine/install/)
-   Install server side project and start server

```sh
$ cd server
$ npm install
$ docker compose up & # for starting mongo and redis
$ npm start
```

-   Install client side project and start client

```sh
$ npm i -g yarn
$ cd client
$ yarn install
$ yarn start
```

View the website at: http://localhost:3000
