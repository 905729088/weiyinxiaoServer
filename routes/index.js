const express = require('express');
const router = express.Router();
const request = require('request');
let phoneList = [];

//app端接口
router.post('/ipaddr', function(req, res, next) {
    console.log("ipadder收到");
    res.send({ code: 0, messmage: "succsess" });
    const nowData = new Date();
    const ipaddr = {
            ip: req.body.ip,
            mac: req.body.mac,
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

router.post('/taskStatus', function(req, res, next) {
    res.send({ code: 0, messmage: "succsess" });
});



//checkPhoneList();


//前端接口
router.post('/phone', function(req, res, next) {
    console.log("Phone收到");
    checkPhoneListDate(res);

});

async function checkPhoneListDate(res, t = 120) {
    //删除已经超过两分钟的数据
    let arr = [];
    let newT = new Date().getTime() + 10;
    for (let i = 0; i < phoneList.length; i++) {
        if (newT - phoneList[i].lastTime < 1000 * t) {
            arr.push(phoneList[i]);
        }
    }
    phoneList = arr;
    res.send(phoneList);
}

module.exports = router;