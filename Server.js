const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser'); 
const app = express();


app.use(bodyParser.json()); 

const PORT = process.env.LOCAL_PORT;
const db = require('./db');

app.use('/user', require('./routes/userRoutes'));


app.get('/' , (req,res) => {
    res.send("this is default get request");
})

app.listen(PORT, () => {
    console.log('Server started');
});
