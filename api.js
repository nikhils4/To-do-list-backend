// requiring modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// requiring local modules
const openRoutes = require('./Routes/open');
const auth = require('./Routes/auth');

//db connect
require('./Helpers/connect.js');

// env config
require('dotenv').config();
const app = express();

// presets
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// port declaration
const port = process.env.PORT || 3000;

// open routes
app.use('/', openRoutes);
app.use('/auth', auth);


// middleware (AUTH)
// const = middleware = require()

// Init the server
app.listen( port, () => {})
