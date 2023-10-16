const express = require('express');
const mongoose = require('mongoose');


const app = express();

dbURI = 'mongodb://localhost:27017/BMS';


mongoose.connect(dbURI);

app.listen(3000, () => {
    console.log("app is listening on port 3000");
});
