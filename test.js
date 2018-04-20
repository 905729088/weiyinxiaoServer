// var http = require('http');
// http.createServer(function(req, res) {
//     //暂存请求体信息
//     var body = "";

//     //请求链接
//     console.log(req.url);

//     //每当接收到请求体数据，累加到post中
//     req.on('data', function(chunk) {
//         body += chunk; //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
//         console.log("chunk:", chunk.toString());
//     });
//     req.on('end', function() {
//         res.write("OK");
//         res.end();
//     });

// }).listen(3000);
// console.log("started:");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// app.post('/mytest', function(req, res) {
//     console.log(req.body);
//     res.send(" post successfully!");
// });

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/mytest', multipartMiddleware, function(req, res, next) {

    console.log(req.body);
    next();
});

app.listen(3000);
console.log(fn);
async function fn() {
    return '1';
}