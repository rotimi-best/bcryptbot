'use strict'

require('dotenv').config();

const bcrypt = require('bcryptjs');
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const {
  BOT_TOKEN,
  PORT,
  HOST,
  ADMIN_CHATID
} = process.env;

const tg = new Telegram.Telegram(BOT_TOKEN, {
  workers: 1,
  webAdmin: {
    port: PORT,
    host: HOST
  }
});

class OtherwiseController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    async handle($) {
      const firstName = $.message.chat.firstName || $.message.chat.lastName;
      const username = $.message.chat.username || "";
      const inbox = $.message.text;
      
      console.log("inbox", inbox);

      if (inbox) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(inbox, salt);

        $.sendMessage(`${hash}`, {
          parse_mode: 'Markdown'
        });

        tg.api.sendMessage(
          ADMIN_CHATID,
          `${firstName} used your bot and sent ${inbox}`
        );
      } else {
        $.sendMessage(`Please send me a text.`);

        tg.api.sendMessage(
          ADMIN_CHATID,
          `${firstName} (@${username}) used your bot and didnt send a text`
        );
      }
  }
}

tg.router
  .otherwise(new OtherwiseController())