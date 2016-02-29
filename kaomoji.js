'use strict'
const botId = require('./config.js').slack.bot
const S = require('./clients.js').web
const dict = [
  'ฅ( •ω• ฅ)ｶﾞｵ-',
  '(*ฅ•̀ω•́ฅ*)ｶﾞｵｰ',
  '(｢･ω･)｢ｶﾞｵｰ',
  '(｢`･ω･)｢ｶﾞｵｰ',
  '(｢ΦωΦ)｢ｶﾞｵｰ',
  'ฅ(๑•̀ω•́๑)ฅｶﾞｵｰ★',
  'ฅ(•∀•ฅ)ｶﾞｵ-',
  'ฅ(º ﾛ º ฅ)ｶﾞｵ-'
]

function reply (text, channel) {
  if (text === `<@${botId}>`.trim() || text === `<@${botId}>:`.trim()) {
    S.chat.postMessage(channel,
      dict[Math.floor((Math.random() * dict.length))],
      {as_user: true}
    )
  }
}

exports.reply = reply
