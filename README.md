# MERN Video Streaming Project

## Overview

This is a MERN-based video streaming project with a backend composed of three
separate services that communicate via messages through Redis. The project
includes an API server, a video conversion service, and an HTTP server that serves HLS video files. The client-side is built with create-react-app and MUI
library, and uses socket.io-client and React Context.

### Backend Services

#### API Server

The API server is an Expressjs app that uses Joi, Multer, BullMQ, Socket.io, and
MongoDB driver. The server communicates with Redis to process and store data,
and uses MongoDB as the primary database. The database and Redis are spun up via
the docker-compose command.

#### Video Conversion Service

The video conversion service is a node process that is responsible for
converting videos and communicating with Redis via the BullMQ library. The
service is not exposed to any HTTP port.

#### HTTP Server

The HTTP server is a plain and simple server that serves HLS video files.

### Client App

The client app is based on create-react-app and MUI library. It uses
socket.io-client and React Context to communicate with the API server and
display the video content.

## Installation

To run the project locally, follow these steps:

### 1. Clone the repository

```bash
git clone git@github.com:foyzulkarim/mern-video-streaming.git
```

### 2. Install dependencies using npm

#### 2.1 Server dependencies

```bash
cd server
npm install
```

#### 2.2 Client dependencies

```bash
cd client
yarn 
```

### 3. Start the database and Redis using docker-compose

```bash
docker-compose up -d
```

### 4. Start the application

#### 4.1 Start the server

This will start all the three backend services.
```bash
cd server
npm run dev
```

#### 4.2 Start the client

```bash
cd client
yarn start
```

### 5. Usage

You can now access the application at http://localhost:3000.

## Note

Before running the above commands, make sure that you have Docker and
Node.js installed on your machine.

This readme file is not finished yet. I will update it as I go along with the project. Thanks.
