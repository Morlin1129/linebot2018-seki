// expressを読み込み
var express = require("express");
var app = express();

app.set('view engine', 'ejs');

// サーバーの設定test
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
  var recipes = [{
    title : "卵焼き",
    syokuzai : [
       {
        material : "卵",
        amount : "1個"
       },
       {
        material : "塩",
        amount : "大さじ1"
       },
       {
        material : "砂糖",
        amount : "大さじ1"
       },
    ],
    tukurikata : "材料を混ぜ、フライパンに油を引く。全体にいきとどいたら丸めていく",
    yosan : "１００円"
  },
  {
    title : "料理の名前",
  syokuzai : [
     {
      material : "食材A",
      amount : "大さじ1"
     },
     {
      material : "食材B",
      amount : "大さじ1"
     },
     {
      material : "食材C",
      amount : "大さじ1"
     },
  ],
  tukurikata : "いためる",
  yosan : "5000兆円"
}
];
  if(text.match(/こんにちは|こんにちわ|今日は|Hello|ごきげんよう/) ){
    message = 'こんにちは！';
    var now = new Date();
    now.setTime(now.getTime() + 1000*60*60*9);
    var hour = now.getHours();
    message += '今は' + hour + '時です';
  } else if(text.match(/こんばんは|こんばんわ/) ){
  　message = 'こんばんは！'
} else if(text.match(/レシピ/) ){
  　message = 'とりあえずまずは1つ目のレシピをだしてみます\n';
  var searchMaterial =  text.split("レシピ")[0].trim();
  console.log('searchMaterial:' + searchMaterial);
  var filteredRecipes = recipes.filter(function(v) {
    for(var i = 0; i < v.syokuzai.length; i++) {
      console.log('s.material'+v.syokuzai[0].material)
      if(searchMaterial.indexOf(v.syokuzai[0].material) >= 0) {
        return true;
      }
    }
    return false;
  });
  var recipe;
  if(filteredRecipes.length) {
    recipe = filteredRecipes[0];
    message += "こちらのレシピが見つかりました！";
  } else {
    message = "お探しの食材のレシピは見つかりませんでした";
    return message;
  }
  message += "---" + "\n";
  message += recipe.title + "\n";
  message += recipe.yosan + "\n";
  message += "◇材料◇" + "\n";

  for (var i = 0 ; i < recipe.syokuzai.length; i++) {
    message += "・" + recipe.syokuzai[i].material +
    "--" + recipe.syokuzai[i].amount + "\n";
  }
  message += recipe.tukurikata + "\n";

  } else  {
    message = 'まだあいさつくらいしか返せません・・・'
  }
  return message;
}
