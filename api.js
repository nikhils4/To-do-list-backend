// requiring modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// env config
require('dotenv').config();
const app = express();

// requiring local modules
const openRoutes = require('./Routes/open');
const auth = require('./Routes/auth');
const publiclist = require('./Routes/publiclist');
const privatelist = require('./Routes/privatelist');
const share = require('./Routes/share');

//db connect
require('./Helpers/connect.js');

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

//secure routes
app.use('/secure', publiclist);
app.use('/secure', privatelist);
app.use('/share', share);

// Init the server
app.listen( port, () => {})
