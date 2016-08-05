const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

//App setup
  //express middleware
  //morgan is a logging framework
app.use(morgan('combined'));
app.use(cors());
  //bodyParser will parse incoming requests in JSON
app.use(bodyParser.json({type: '*/*'}));
router(app);


//Server setup
const port = process.env.PORT || 3090
const server = http.createServer(app);
server.listen(port);
console.log('Serving listening on:', port);