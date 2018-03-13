const express = require('express');
const router = express.Router();
//WebSocket  持续实时的将消息发送到前端页面
const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8010 });
let webArr = [];
let webNum = 0;
wss.on('connection', function(ws) {
    webNum++;
    let webName = webNum; //本次连接的唯一标识
    webArr.push({ name: webName, webSend: ws });
    ws.on('close', (code, reason) => {
        let arrIndex = webArr.findIndex(function(value) {
            return value.name == webName;
        });
        webArr.splice(arrIndex, 1);
        console.log("连接关闭", code);
    })
});
//接收app的消息
router.post('/', function(req, res, next) {
    res.send({ code: 1, message: 'success' }); //返回给后台
    for (let value of webArr) {
        value.webSend.send(JSON.stringify(req.body)); //发送给前端页面
    }
})
module.exports = router;