const TelegramBot = require("node-telegram-bot-api");
const sdk = require("api")("@tron/v4.4.2#39lxa3hl0qj5m48");
const cron = require("node-cron");
const HandyStorage = require("handy-storage");
require('dotenv').config();

const storage = new HandyStorage({
  beautify: true,
});

// Telegram's token 
const token =process.env.TOKEN;
const address = process.env.ADDRESS;
const file_path = "./my_data.json";

storage.connect(file_path);
// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome to <b>Crypto Tron Tracker</b>, thank you for using my service, we will send you daily updates `,
    {
      parse_mode: "HTML",
    }
  );

  storage.setState({
    Ids: [...new Set([...storage.state.Ids, chatId])],
  });
});

//running task daily
cron.schedule("0 0 0 * * *", () => {
  console.log("running a task every day");
  sendNotifcationForBalance(address);
  sendNotifcationForTransctionDetails(address);
  //
});

 function sendNotifcationForBalance(address) {
    sdk["get-account-info-by-address"]({ address: address })
      .then((res) => {
        const { balance } = res.data[0];
        const message = `<b> Balance</b>: <b>${balance}</b>`;
        getStoredUsers(message);
      })
      .catch((err) => console.error(err));
  }
  
  function sendNotifcationForTransctionDetails(address) {
    sdk["get-transaction-info-by-account-address"]({ address: address })
      .then((res) => {
        const { data } = res;
  
        let message = "";
        data.forEach((el) => {
          message += `<pre><b> txID</b>: <b>${el.txID}</b> 
              <b> NetFee</b>: <b>${el.net_fee}</b>  
             <b> To</b>: <b>${el.raw_data.contract[0].parameter.value.to_address}</b>
             <b> From</b>: <b>${el.raw_data.contract[0].parameter.value.owner_address}</b>
             <b> Amount</b>: <b>${el.raw_data.contract[0].parameter.value.amount}</b> </pre> \n
             `;
        });
  
        getStoredUsers(message);
      })
      .catch((err) => console.error(err));
  }

function getStoredUsers(message) {
    const users = storage.state.Ids;
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        bot.sendMessage(users[i], message, {
          parse_mode: "HTML",
        });
      }
    } else {
      console.log("no user registered");
    }
  }
