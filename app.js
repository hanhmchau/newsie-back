const env = require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

var app = express();

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

module.exports = app;
