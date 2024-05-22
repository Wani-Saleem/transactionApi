const mongoose = require('mongoose');
require('dotenv').config();

const DB_PORT = process.env.DEV_DB_URL;

mongoose.connect(DB_PORT, {});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Successfully connected');
})

db.on('disconnected', () => {
    console.log('Disconnected');
})

db.on('error', (err) => {
    console.log(err);
})

module.exports = db;