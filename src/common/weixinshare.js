/**
 * Created by ruindong on 2017/5/15.
 */
//随机字符串
import wx from 'weixin-js-sdk'
import axios from 'axios';
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/*title:微信分享的标题，desc:微信分享的描述，link:微信分享的连接地址，imgUrl:微信分享的图片地址，successFun:分享成功执行的方法， cancleFun：取消分享执行的方法*/
  //微信注册事件
export default {
  InitShare:function(title,desc,imgUrl,successFun,cancleFun) {
    //获取随机字符串
    var nonceStr = randomString(16);
    //获取当前时间戳
    var timestamp = Math.round(new Date().getTime() / 1000);
    axios.get('http://api3.dfhon.cn/v1/lottery.json?action=GetWeChatJsapiTicket',).then((ticketData)=>{
      //获取jsapi_ticket接口
      var ticket =ticketData.data;
      //根据一系列规则获取签名
      var url = location.href.split("#")[0];
      var str = "jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
      var signature = hex_sha1(str);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxbc67a643bdce350d', // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名，见附录1
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareQZone',
          'onMenuShareWeibo',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      // wx.error(function(res){//用于错误调试
      //   alert(res);
      //   // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      //
      // });
      // wx.checkJsApi({
      //   jsApiList: ['onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      //   success: function(res) {
      //     alert(res)
      //   }
      // });
      wx.ready(function () {
        //发送给朋友
        wx.onMenuShareAppMessage({
          title: title,
          desc:desc,
          link: window.location.href,
          imgUrl: imgUrl,
          success: function (res) {
            successFun();
          },
          cancel: function (res) {
            cancleFun();
          }
        });

        //分享到朋友圈
        wx.onMenuShareTimeline({
          title:title,
          link:window.location.href,
          imgUrl:imgUrl,
          success: function (res) {
            successFun();
          },
          cancel: function (res) {
            cancleFun();
          }
        });

        //分享到QQ
        wx.onMenuShareQQ({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl:imgUrl, // 分享图标
          success: function () {
            successFun();
          },
          cancel: function () {
            cancleFun();
          }
        });

        //分享到QQ空间
        wx.onMenuShareQZone({
          title:title, // 分享标题
          desc: desc, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl: imgUrl, // 分享图标
          success: function () {
            successFun();
          },
          cancel: function () {
            cancleFun();
          }
        });
      })
    });
  }
}
var hexcase = 0;
var chrsz = 8;
function hex_sha1(s){
  return binb2hex(core_sha1(AlignSHA1(s)));
}
function core_sha1(blockArray){
  var x = blockArray;
  var w = Array(80);
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  var e = -1009589776;
  for (var i = 0; i < x.length; i += 16) // 每次处理512位 16*32
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;
    for (var j = 0; j < 80; j++) // 对每个512位进行80步操作
    {
      if (j < 16)
      w[j] = x[i + j];
    else
      w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)))
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return new Array(a, b, c, d, e);
}
/** 返回对应F函数的值*/
function sha1_ft(t, b, c, d){
  if (t < 20)
  return (b & c) | ((~ b) & d);
  if (t < 40)
  return b ^ c ^ d;
  if (t < 60)
  return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d; // t<80
}
/** 返回对应的Kt值*/
function sha1_kt(t){
  return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}
/** 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法*/
function safe_add(x, y){
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}
/** 32位二进制数循环左移*/
function rol(num, cnt){
  return (num << cnt) | (num >>> (32 - cnt));
}
function AlignSHA1(str){
  var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16);
  for (var i = 0; i < nblk * 16; i++)
  blks[i] = 0;
  for (i = 0; i < str.length; i++)
  blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);
  blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
  blks[nblk * 16 - 1] = str.length * 8;
  return blks;
}
function binb2hex(binarray){
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
  }
  return str;
}
function calcDigest(){
  var digestM = hex_sha1(document.SHAForm.SourceMessage.value);
  document.SHAForm.MessageDigest.value = digestM;
}

