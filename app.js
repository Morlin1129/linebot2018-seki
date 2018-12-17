// expressを読み込み
var express = require("express");
var app = express();

app.set('view engine', 'ejs');

// サーバーの設定
var server = app.listen(process.env.PORT || 5000);

app.get("/", function(req, res, next){ //追加
  res.render('index.ejs', {text: 'こんにちは'}); //追加
}); //追加

app.get("/hello", function(req, res, next){
  var message = 'こんにちは'; //追加
  message = getMessageText(req.query.text);
  res.json(message); //'こんばんは'をmessageに書き換え
});

//今後LINEに接続するときに使います
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: 'L6TLIl9BGxqVf1m6+ZEUlTc4vfsJO+fMfnlxix74GcvgurL1JDMSbW/ib4LBvPEE2IeduFtJNi6G4PGNpsveKYW8rlf1L3dz/8Vvld/iv480GM+rgTetRmeT7RzqytIrc9ML0K+sEg+m2ZqsmHXEGgdB04t89/1O/w1cDnyilFU=',
  channelSecret: '446d6aa73cacdfe122e1b2b2cfdb2ff8'
};

app.post('/line', line.middleware(config), function(req, res) {
  Promise
  .all(req.body.events.map(handleEvent))
  .then(function(result) {
    res.json(result)
  });
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: getMessageText(event.message.text)
  });
}

//ここまでLINEに接続するコード

//まずはここを触っていきます。
function getMessageText(text) {
  var message;
  if(text.match(/こんにちは|こんにちわ|今日は|Hello|ごきげんよう/) ){
    message = 'こんにちは！';
    var now = new Date();
    now.setTime(now.getTime() + 1000*60*60*9);
    var hour = now.getHours();
    message += '今は' + hour + '時です';
  } else if(text.match(/こんばんは|こんばんわ/) ){
  　message = 'こんばんは！'
  } else {
    message = 'まだあいさつくらいしか返せません・・・'
  }
  return message;
}
