var express = require('express');
var router = express.Router();
var request = require('request');
let mobileIp = ['192.168.1.111'];
let phoneList = [];
for (var i = 0; i < 10000; i++) {
    phoneList.push(i);
}
//
router.get('/phoneIp', function(req, res, next) {
    // mobileIp.push(req.query.ip)
    res.send(req.query);
    console.log("收到" + req.query.id);
})

router.post('/ipaddr', function(req, res, next) {
    let nowData = new Date();
    const ipaddr = {
            ip: req.body.ip,
            ime: req.body.ime,
            mode: req.body.mode,
            last: {
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
        phoneList[arrIndex].last = ipaddr.last;
    }

});
router.post('/Phone', function(req, res, next) {
    //phoneList = req.body;

    res.send(phoneList);
});
//原来没有用 正式之后可以删除
// router.get('/getFriendStatus', function(req, res, next) {
//     const tel = req.query.tel;

//     if (mobileIp.length == 0) {
//         res.send({ code: -1, msg: 'NO MOBILE IP' });
//         return;
//     }

//     let option = {
//         hostname: mobileIp[0],
//         port: '5000',
//         path: "/GetFriendStatus",
//         method: 'post',
//         headers: {
//             'content-Type': 'text/plain;charset=utf-8'
//         }
//     }

//     let reqRe = http.request(option, function(result) {
//         result.setEncoding('utf8');
//         result.on('data', function(data) {
//             res.send(data);
//         });
//     });

//     reqRe.on('error', function(e) {
//         console.log('getFriendStatus', 'error')
//         res.send({ code: -1, msg: e.message });
//     });

//     reqRe.write(tel);

//     reqRe.end();
// })
module.exports = router;