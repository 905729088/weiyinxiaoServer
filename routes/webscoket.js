let express = require('express');
let router = express.Router();
//WebSocket  持续实时的将消息发送到前端页面
let WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8010 });
let webArr = [];
let webNum = 0;
wss.on('connection', function(ws) {
    webNum++;
    let isWebSend = true; //本次连接的状态
    let webName = webNum; //本次连接的唯一标识
    webArr.push({ name: webName, webSend: ws, isWebSend: isWebSend });

    ws.on('close', (code, reason) => {
        let arrIndex = webArr.findIndex(function(value) {
            return value.name == webName;
        });
        webArr.splice(arrIndex, 1);
        isWebSend = false;
        console.log("连接关闭", code);
    })
});

router.get('/test11', function(req, res, next) {
    // console.log('ws-->', webSend)
    res.send({ code: 1, message: 'success' }); //返回给后台
    for (let value of webArr) {
        value.webSend.send(JSON.stringify(req.query)); //发送给前端页面
    }
    //if (isWebSend) webSend.send(JSON.stringify(req.query)); //发送给前端页面
})
module.exports = router;