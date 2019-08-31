const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open', () => true).on('error', () => false);