# MERN Video Streaming

Hello people, welcome to the repository. This is a real-world project that allows users to stream, upload, manage videos. It is also part of the [`Learn MERN in Bangla Like a pro`](https://youtube.com/playlist?list=PLEYpvDF6qy8ZUE9IyhYWrxt5zEyeXzwxq) playlist and you can learn and contribute to this repository.

## Key features

- Upload videos on server
- Process video mp4 to hls
- Realtime notification of processed video

## Architecture diagram

![alt text](https://drive.google.com/uc?export=view&id=1bZAX_UpwIsYPjaq92-usdPTElwOwDlbW)

## Technology used here

- Programming language: `JavaScript`
- JavaScript runtime: `Node.js`
- Framework for handling HTTP requests and responses: `Express.js`
- Database: `MongoDB`
- UI library: `React`
- Component library: `MUI`
- Websocket implementation: `Socket.io`
- Video processing: `ffmpeg`
- File uploading: `multer`
- Pub/sub messaging system: `Redis`

## Installation and run the projects

-   To run this project, you need to install the following softwares first:
    -  Node.js [`download link`](https://nodejs.org/en/download/)
    -  Docker [`installation instruction`](https://docs.docker.com/engine/install/)
    -  Docker Compose [`installation instruction`](https://docs.docker.com/compose/install/)
-   Start server side project development server

```sh
$ cd server
$ npm install
$ docker compose up & # for starting mongo and redis
$ npm start
```

-   Start client side project development server

```sh
$ npm i -g yarn
$ cd client
$ yarn install
$ yarn start
```

View the website at: http://localhost:3000
