const express = require('express'),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    app = express(),
    index = require('./routes/index.js'), //路由
    webSocket = require('./routes/webscoket.js');

//解決跨越问题
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
}

app.use(allowCrossDomain)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("123456789abc"));
app.use('/', index);
app.use('/Message', webSocket);

app.get('/', function(req, res) {
    res.send('Hello World');
});

const server = app.listen(8083, function() {

    const host = server.address().address;
    const port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})