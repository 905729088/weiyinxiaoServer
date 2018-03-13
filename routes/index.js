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
    const nowData = new Date();
    const ipaddr = {
            ip: req.body.ip,
            ime: req.body.ime,
            mode: req.body.mode,
            lastTime: {
                hour: nowData.getHours(),
                mimnute: nowData.getMinutes(),
                second: nowData.getSeconds()
            }
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
router.post('/Phone', function(req, res, next) {
    res.send(phoneList);
});
module.exports = router;