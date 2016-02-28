const config = require('./config.js')
const EVENTS = require('slack-client').RTM_EVENTS
const clients = require('./clients.js')
const weather = require('./weather.js')
const kaomoji = require('./kaomoji.js')
const twitterlist = require('./twitterlist.js')
const reminder = require('./reminder.js')
const r = clients.rtm
const S = clients.web
const adminId = config.slack.admin
const botId = config.slack.bot

weather.init()
twitterlist.init()
reminder.init()

r.start()
r.on(EVENTS.MESSAGE, function (msg) {
  // message that includes @<bot user>
  // TODO: should probably move to Botkit or somothing.
  if (msg.text && msg.text.includes(`<@${botId}>`)) {
    kaomoji.reply(msg.text, msg.channel)
    weather.reply(msg.text.toLowerCase(), msg.channel)
  }
})

r.on(EVENTS.CHANNEL_CREATED, function (msg) {
  S.dm.open(adminId, (_, data) => S.chat.postMessage(
    data.channel.id,
    `<@${msg.channel.creator}> created chanel <#${msg.channel.id}>, could you invite me to the channel?`,
    { as_user: true }
  ))
})

