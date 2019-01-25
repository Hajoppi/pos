const TeleBot = require('telebot'),
      config = require('./config'),
      pos = require('./pos'),
      token = config.botToken;

const bot = new TeleBot(token);

pos.init();
pos.clear();

let upper = "";
let lower = "";
/*
bot.on(/^\/msg (.+)$/, (msg, props) => {
  const text = props.match[1];
  lower = upper;
  upper = text;
  pos.clear();
  pos.upper(upper);
  pos.lower(lower);
});*/
bot.on('text', (msg) => {
  const text = msg.text;
  lower = upper;
  upper = text;
  pos.clear();
  pos.upper(upper);
  pos.lower(lower);
});

bot.start();
