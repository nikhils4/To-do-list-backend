const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
// mongoose.connect('mongodb://127.0.0.1:27017/To-do');

mongoose.connection.once('open', () => true).on('error', () => false);