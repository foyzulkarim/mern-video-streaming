require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(compression());

const corsOptions = {
    //To allow requests from client
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  };
app.use(cors(corsOptions));

app.use('/thumbnails', express.static('./uploads/thumbnails'));

module.exports = app;
