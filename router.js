'use strict'
const config = require('./config.js')
const EVENTS = require('slack-client').RTM_EVENTS
const clients = require('./clients.js')
const weather = require('./weather.js')
const kaomoji = require('./kaomoji.js')
const twitter_list = require('./twitter_list.js')
const twitter_reaction = require('./twitter_reaction.js')
const reminder = require('./reminder.js')
const book = require('./book.js')
const r = clients.rtm
const S = clients.web
const adminId = config.slack.admin
const botId = config.slack.bot

const http = require('http')
const server = http.createServer()
server.listen(5432)
server.on('request', (req, res) =>{
  if (req.headers.host){
    book()
  }
})

weather.init()
reminder.init()
twitter_list.init()

r.start()
r.on(EVENTS.MESSAGE, msg => {
  // message that includes @<bot user>
  // TODO: should probably move to Botkit or somothing.
  if (msg.text && msg.text.includes(`<@${botId}>`)) {
    if (msg.channel === 'G0PESJ6RX' && msg.text.includes('restart twitter')) {
      return twitter_list.restart()
    }
    kaomoji.reply(msg.text, msg.channel)
    weather.reply(msg.text.toLowerCase(), msg.channel)
    return
  }
})

r.on(EVENTS.REACTION_ADDED, msg => {
  twitter_reaction.on(msg)
})

r.on(EVENTS.REACTION_REMOVED, msg => {
  twitter_reaction.off(msg)
})

r.on(EVENTS.CHANNEL_CREATED, msg => {
  S.dm.open(adminId, (_, data) => S.chat.postMessage(
    data.channel.id,
    `<@${msg.channel.creator}> created chanel <#${msg.channel.id}>, could you invite me to the channel?`,
    { as_user: true }
  ))
})

