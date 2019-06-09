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
const manager = require('./manager')

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
      const inbox = $.message.text;
      
      console.log("inbox", inbox);

      if (inbox) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(inbox, salt);

        $.sendMessage(`${hash}`, {
          parse_mode: 'Markdown'
        });

        manager(tg, $);
      } else {
        $.sendMessage(`Please send me a text.`);

        manager(tg, $);
      }
  }
}

tg.router
  .otherwise(new OtherwiseController())