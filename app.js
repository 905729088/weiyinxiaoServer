var express = require('express'),
bodyParser=require("body-parser"),
cookieParser=require("cookie-parser"),
 app = express();

//scoket

 var myController= require('./controller/index.js');
//路由
var index = require('./routes/index.js');
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
}

app.use(allowCrossDomain)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser("123456789abc"));

app.get('/', function(req, res) {
    res.send('Hello World');
})
app.get('/test', function(req, res) {
    res.send('路由');
    /*const user=req.query["user"],
    pass=req.query["pass"];
    console.log(user,pass);*/
})
app.post('/test', function(req, res) {
    //获取值
    /*
     const user=req.body["user"],
    pass=req.body["pass"];
    */
   const user=req.body["user"],
    pass=req.body["pass"];
    console.log(user,pass);
    myController(user);
    index();
})
var server = app.listen(8083, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})