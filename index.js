const req = require("request-promise");
const MD5 = require("./md5");

var uid = "128797884";
var secret = "15bc672d02b498bb";
var getSign = function(str) {
  str += "&secret=" + secret;
  return MD5.hex_md5(str.split("&").sort().join(""));
}
var genUnixTime = function() {
  return Math.round(+new Date() / 1e3);
}
var buildRequest = function(data) {
  var paramArr = [
    "uid=" + uid,
    ...data.split("&"),
    // "t=" + genUnixTime()
    // "t=1523239134"
  ];
  var origReq = paramArr.join("&");
  // return origReq + "&sign=" + getSign(origReq);
  return getSign(origReq);
}
var data = "fid=87232772&idx=2&t=1523241851";
console.log(buildRequest(data));

// req({
//   method: "POST",
//   uri: "https://pirate-api.hortor002.com/testapi/game/killtitan/attack-titan",
//   headers: {
//     "charset": "utf-8",
//     "Accept-Encoding": "gzip",
//     "referer": "https://servicewechat.com/wxec8f800476c3964a/5/page-frame.html",
//     "User-Agent": "MicroMessenger/6.6.5.1280(0x26060536) NetType/WIFI Language/zh_CN",
//     "Connection": "Keep-Alive"
//   },
//   proxy: "https://192.168.10.212:8888",
//   form: buildRequest(data)
// }).then(data => {
//   console.log(data);
// }).catch(err => {
//   console.log(err);
// });