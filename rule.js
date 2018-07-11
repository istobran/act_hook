const MD5 = require("./md5");
const host = "pirate-api.hortor002.com";
var secret = "";

function resolveURLBuffer(buf) {
  var rawString = buf.toString();
  return new Map(rawString.split("&").map(str => str.split("=")));
}

function mapToURLBuffer(map) {
  var params = Array.from(map.entries()).map(i => i.join("=")).join("&");
  return Buffer.from(params, "utf-8");
}

function genSign(map) {
  if (map.has("sign")) map.delete("sign");
  var signSource = Array.from(map.entries())
                    .map(i => i.join("="));
  signSource.push("secret=" + secret);
  return MD5.hex_md5(signSource.sort().join(""));
}

module.exports = {
  summary: "hortor rule for AnyProxy",
  *beforeSendRequest(req) {     // ES6 Generator
    var reqOpts = req.requestOptions;
    if (reqOpts && reqOpts.hostname == host && reqOpts.method == "POST") {
      // 提取secret
      var reqMap = resolveURLBuffer(req.requestData)
      if (secret && reqOpts.path == "/game/killtitan/attack-titan") {
        var damage = reqMap.get("damage");
        if (reqMap.get("buffing") == "true") {
          reqMap.set("damage", 200);
          reqMap.set("sign", genSign(reqMap));
          console.log("attack titan request body:", reqMap);
          return { requestData: mapToURLBuffer(reqMap) };
        } else if (damage && +damage < 100) {
          reqMap.set("damage", 100);
          reqMap.set("sign", genSign(reqMap));
          console.log("attack titan request body:", reqMap);
          return { requestData: mapToURLBuffer(reqMap) };
        }
      }
      if (secret && reqOpts.path == "/game/octopus/open") {
        if (!+(reqMap.get("idx"))) {   // drop request
          console.log("execute drop request and response instantly: ", reqMap);
          return {
            response: {
              statusCode: 200,
              header: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Credentials": "false",
                "Access-Control-Allow-Headers": "Origin,Accept,Content-Type,Authorization",
                "Access-Control-Allow-Origin": "*",
                "Connection": "keep-alive"
              },
              body: JSON.stringify({
                "data": {},
                "errcode": 0,
                "errmsg": ""
              })
            }
          };
        }
      }
    }
    return null;
  },
  *beforeSendResponse(req, res) {
    var reqOpts = req.requestOptions;
    if (reqOpts && reqOpts.hostname == host && reqOpts.path == "/game/basic/login" && reqOpts.method == "POST") {
      // 提取secret
      var resp = JSON.parse(res.response.body.toString());
      if (!secret) {
        secret = resp.data.secret;
        console.log("secret初始化完成", secret);
      } else {
        secret = resp.data.secret;
        console.log("secret更新完成", secret);
      }
    }
    return null;
  }
};