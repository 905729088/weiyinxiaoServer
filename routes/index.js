const express = require('express');
const router = express.Router();
const request = require('request');
const http = require('http');
let phoneList = []; //上线手机数组
let completeTask = []; //完成任务数组
let messageArr = []; //消息通知内容数组
// {
//     ip: '192.168.1.113',
//     mac: 'AV:BC:AD:LA1C1',
//     model: '华为',
//     connecttime: new Date().getTime()
// }, {
//     ip: '192.168.1.113',
//     mac: 'AV:BC:AD:L11P2',
//     model: '华为',
//     connecttime: new Date().getTime()
// }
//测试
//app端接口
router.post('/mytest', function(req, res, next) { //G.api.proxypost(G.sid,'http://192.168.1.147:5758/mytest',null,"{a:1}")
    getBody(req, data => {
        console.log('测试2', typeof(data));
        res.send({ code: 0, messmage: "succsess" });
    });
});
//app端接口
router.post('/ipaddr', function(req, res, next) {
    res.send({ code: 0, messmage: "succsess" });
    const nowData = new Date();
    const ipaddr = {
            ip: req.body.ip,
            mac: req.body.mac,
            model: req.body.model,
            // phoneNuber: req.body.phoneNuber, //手机号码
            // taskCount: req.body.taskCount || 0, //任务个数
            // addCount: req.body.addCount || 0, //添加次数
            // weChatId: req.body.weChatId, //微信号
            connecttime: new Date().getTime()
        }
        //判断该手机是否已经连接了  -1 没有      >=0 有
    arrIndex = phoneList.findIndex(function(value) {
        return value.mac == ipaddr.mac;
    });
    console.log("ipadder收到", ipaddr);
    if (arrIndex < 0) {
        phoneList.push(ipaddr);
    } else {
        phoneList[arrIndex].connecttime = ipaddr.connecttime;
    }

});

router.post('/taskStatus', function(req, res, next) {
    res.send({ code: 0, messmage: "succsess" });
    // if (req.body.status === '0') {
    //     console.log('添加成功');
    console.log('任务结束', req.body);
    completeTask.push(req.body, req.body);
    //}

});


router.post('/message', function(req, res, next) {
    res.send({ code: 1, message: 'success' }); //返回给后台
    console.log(req.body);
    let index = messageArr.findIndex(function(value) {
        return value.ip == req.body.ip && value.mac == req.body.mac && value.title == req.body.title;
    });
    let strArr = req.body.text.split(req.body.title + ': ');
    let msgnum = strArr.length != 1 ? Number(strArr[0].match(/\d+/g)) : 1;
    let msg = strArr.length != 1 ? strArr[1] : strArr[0];
    if (index < 0) {

        messageArr.push({
            ip: req.body.ip,
            mac: req.body.mac,
            title: req.body.title,
            msg: msg,
            msgnum: msgnum,
            receivetime: (new Date).getTime(),
        });
    } else {
        messageArr[index].msg = req.body.msg;
        messageArr[index].msgnum = req.body.msgnum;
        messageArr[index].receivetime = (new Date).getTime();
    }
    //console.log('================>', messageArr);
})

//checkPhoneList();


//前端接口
router.post('/phone', function(req, res, next) {
    // console.log("Phone收到");
    //res.send(phoneList);
    checkPhoneListDate(res);

});

//添加好友
router.post('/AddFriend', function(req, res, next) {
    console.log("添加好友", req.body);

    let obj = {
        hostIp: req.body.ip,
        interface: '/AddFriend',
        data: req.body.msg,
        res: res

    }
    onHttp(obj);
});

//群发消息
router.post('/mass', function(req, res, next) {
    console.log("群发消息", req.body);

    let obj = {
        hostIp: req.body.ip,
        interface: '/Mass',
        data: req.body.msg,
        res: res

    }
    onHttp(obj);
});

//发朋友圈
router.post('/FriendCircle', function(req, res, next) {
    console.log("发朋友圈", req.body);

    let obj = {
        hostIp: req.body.ip,
        interface: '/FriendCircle',
        data: req.body.msg,
        res: res

    }
    onHttp(obj);
});

//聊天回复
router.post('/getmessgae', function(req, res, next) {
    //console.log("聊天回复 ip mac", req.body);
    let sendArr = [];
    let rArr = req.body.arr;
    for (let i = 0; i < rArr.length; i++) {
        for (let j = 0; j < messageArr.length; j++) {
            if (rArr[i].ip == messageArr[j].ip && rArr[i].mac == messageArr[j].mac) {
                sendArr.push(Object.assign(messageArr[j], { wechat: rArr[i].wechat }));
                messageArr.splice(j, 1);
            }
        }
    }
    res.send(sendArr);

});

//查询任务状态
router.post('/checkTask', function(req, res, next) {
    //if (req.body.length == 0) return;
    let dataArr = req.body;
    for (let i = 0; i < completeTask.length; i++) {
        for (let j = 0; j < dataArr.length; j++) {
            if (completeTask[i].taskId == String(dataArr[j].taskId)) {
                completeTask.splice(i, 1);
                dataArr.splice(j, 1);
            }
        }
    }
    res.send(dataArr);

});

//暂停任务
router.post('/PauseWork', function(req, res, next) {
    console.log("暂停任务");
    let arr = req.body;
    for (let i = 0; i < arr.length; i++) {
        let obj = {
            hostIp: arr[i].ip,
            interface: '/PauseWork',
            data: arr[i].taskId,
            res: res
        }
        onHttp(obj);
    }
    res.send('任务暂停');
});

//继续任务
router.post('/ProceedWork', function(req, res, next) {
    console.log("继续任务");
    let arr = req.body;

    for (let i = 0; i < arr.length; i++) {
        let obj = {
            hostIp: arr[i].ip,
            interface: '/ProceedWork',
            data: arr[i].taskId,
            res: res
        }
        onHttp(obj);
    }
    res.send('任务继续');
});
async function checkPhoneListDate(res, t = 120) {
    //删除已经超过两分钟的数据
    let arr = [];
    let newT = new Date().getTime() + 10;
    for (let i = 0; i < phoneList.length; i++) {
        if (newT - phoneList[i].connecttime < 1000 * t) {
            arr.push(phoneList[i]);
        }
    }
    phoneList = arr;
    res.send(phoneList);
}
// let p = {
//     hostIp: '192.168.1.111',
//     interface: '/GetFriendStatus',
//     data: { 1231312: 123 },
//     res: null,
//     contentTepe: null
// };

// console.log('========>', onHttp(p).then(res => {
//     console.log('+++++++++++', res);
// }));
// 获取body
function getBody(req, fn) {
    let data = '';
    // console.log(req.body);
    req.on('data', function(chunk) {
        data += chunk; //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
        //  console.log(chunk.toString());
        //  console.log("chunk:", chunk.toString());
    });
    req.on('end', function() {
        let objJson = (new Function("return " + data))(); //将string 转化成Json格式

        fn(objJson);
    })

}
//node端请求app端接口
async function onHttp(obj) { // ip  接口  发送的内容  回调函数 数据类型

    let option = {
        hostname: obj.hostIp,
        port: '5000',
        path: obj.interface,
        method: 'POST',
        headers: {
            'content-Type': obj.contentTepe || 'text/plain;charset=utf-8'
        },
    };

    let reqRe = http.request(option, function(result) {
        result.setEncoding('utf8');
        result.on('data', function(data) {
            //returnData = data;
            obj.res.send({ code: 0, msg: data });
        });
    });

    reqRe.on('error', function(e) {
        obj.res.send({ code: -1, msg: e.message });
        //  returnData = { code: -1, msg: e.message };
    });

    if (typeof(obj.data) == 'object') {
        //传递json
        reqRe.write(JSON.stringify(obj.data))
    } else {
        //传递string
        reqRe.write(String(obj.data));
    }

    // reqRe.write(JSON.stringify('18844136472'))

    reqRe.end();

}
module.exports = router;