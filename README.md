# MERN Video Streaming

MERN Video Streaming is an open-source, full-stack video streaming platform built using the latest technologies of the MERN stack (MongoDB, Express, React, and Node.js). This project aims to provide a seamless video streaming experience for users, allowing them to upload, manage, and stream videos on demand. In addition, MERN Video Streaming also includes a feature for processing videos and providing real-time notifications when the processing is complete.

## Key Features

- User authentication and authorization for secure access
- User-friendly video upload and management system
- Customizable video player with basic playback controls
- Efficient search functionality to help users find specific videos
- Real-time notifications for video processing status updates

## Getting Started

### Prerequisites

To get started with MERN Video Streaming, you will need to have the following software installed on your local machine:

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/foyzulkarim/mern-video-streaming
```
2. Navigate to the each project directory and install the required dependencies:

```
server : 
cd mern-video-streaming/server
npm install

client :
cd mern-video-streaming/client
npm install
```

3. Start the Docker containers:
For MongoDB and Redis

```
docker-compose up
```

3. Naviate to server and start the server:

```
npm start
```

4. Naviate to client start the client:

```
npm start
```


5. Access the application at `http://localhost:3000` in your web browser.

## Built with Open-Source Technologies

MERN Video Streaming has been built with the following open-source technologies:

- [MongoDB](https://www.mongodb.com/) - A document-based database used to store user and video data
- [Express](https://expressjs.com/) - A Node.js web application framework used for the server-side of the application
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces used for the client-side of the application
- [Node.js](https://nodejs.org/en/) - A JavaScript runtime environment used to run the server-side code

## Contributing to MERN Video Streaming

MERN Video Streaming is an open-source project and we welcome contributions from the community. If you would like to contribute to the project, please refer to the `CONTRIBUTING.md` file for guidelines.

## License

MERN Video Streaming is licensed under the MIT License. Please see the `LICENSE` file for more information.

