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
        console.log(webArr);
        webArr = webArr.filter((value) => {
            return value.name != webName;
        });
        // let arrIndex = webArr.findIndex(function(value) {
        //     return value.name == webName;
        // });
        // webArr.splice(arrIndex, 1);
        console.log("连接关闭", code, webArr.length);
    })
});
//接收app的消息

module.exports = router;