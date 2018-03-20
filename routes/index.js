const express = require('express');
const router = express.Router();
const request = require('request');
let phoneList = [];
//
// router.get('/phoneIp', function(req, res, next) {
//     // mobileIp.push(req.query.ip)
//     res.send(req.query);
//     console.log("收到" + req.query.id);
// })

router.post('/ipaddr', function(req, res, next) {
    console.log("ipadder收到");
    res.send({ code: 0, messmage: "succsess" });
    const nowData = new Date();
    const ipaddr = {
            ip: req.body.ip,
            map: req.body.map,
            mode: req.body.mode,
            phoneNuber: req.body.phoneNuber, //手机号码
            taskCount: req.body.taskCount || 0, //任务个数
            addCount: req.body.addCount || 0, //添加次数
            weChatId: req.body.weChatId, //微信号
            lastTime: new Date().getTime()
        }
        //判断该手机是否已经连接了  -1 没有      >=0 有
    arrIndex = phoneList.findIndex(function(value) {
        return value.ime == ipaddr.ime && value.ip == ipaddr.ip;
    });

    if (arrIndex < 0) {
        phoneList.push(ipaddr);
    } else {
        phoneList[arrIndex].lastTime = ipaddr.lastTime;
    }

});
router.post('/phone', function(req, res, next) {
    console.log("Phone收到");
    res.send(phoneList);
});
module.exports = router;