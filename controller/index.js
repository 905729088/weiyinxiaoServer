let ReportPhoneList=[];
let phoneList=[];
function fn1(){
    console.log(1);
}
function fn2(){
    console.log(2);
}
function fn3(){
    console.log(3);
}
//上报手机信息
async function ipaddr(ip,ime,mode){
    let ipa={
        ip:ip,
        ime:ime,
        mode:mode
    }
    await new Promise((resolve,reject)=>{
        for(var i=0;i<ReportPhoneList.length;i++){
            if(ipa.ime==ReportPhoneList[i].ime){
                break;
            }  
            if(i==ReportPhoneList.length-1){
                resolve();
            } 
        }
    });
    ReportPhoneList.push(ipa);
}
//该接口供前端页面调用

const fnArr=[fn1,fn2,fn3];
function fn(num,reg=0){
    fnArr[num]();
 }
 module.exports=fn;