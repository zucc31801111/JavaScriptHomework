const express = require('express');
const app = express();
require('dotenv/config');
const postRoute = require('./routers/posts');
const upload = require('./routers/upload');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql')
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/upload',upload);
app.use('/posts', postRoute);
app.use(express.static(path.join(__dirname,"../static")))

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.listen(3000);