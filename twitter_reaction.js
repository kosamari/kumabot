'use strict'
const _where = require('lodash.where')
const Twit = require('twit')
const clients = require('./clients.js')
const S = clients.web
const config = require('./config.js').twitter_reaction

const getMessage = (rtmMsg, cb) => {
  const ts = parseInt(rtmMsg.ts, 10)
  S.channels.history(
    rtmMsg.channel,
    {latest: ts + 1, oldest: ts},
    (err, data) => {
      if (err) { return cb(err) }

      const message = _where(data.messages, {ts: rtmMsg.ts})
      if (message) {
        return cb(null, message[0])
      }
      return cb('error', {})
    }
  )
}

const createTwitClient = (user) => {
  if (!user.T) {
    user.T = new Twit(user.tw_credential)
  }
  return user.T
}

const on = (rtmMsg) => {
  if (rtmMsg.reaction === config.fav || rtmMsg.reaction === config.rt) {
    getMessage(rtmMsg.item, (err, msg) => {
      if (err) { return }
      const user = _where(config.users, {slack_id: rtmMsg.user})
      if (user.length) {
        const T = createTwitClient(user[0])
        rtmMsg.reaction === config.fav
          ? T.post('favorites/create', {id: msg.text.match(/\/([0-9]*)>$/)[1]})
          : T.post(`statuses/retweet/${msg.text.match(/\/([0-9]*)>$/)[1]}`)
      }
    })
  }
}

const off = (rtmMsg) => {
  if (rtmMsg.reaction === config.fav || rtmMsg.reaction === config.rt) {
    getMessage(rtmMsg.item, (err, msg) => {
      if (err) { return }
      const user = _where(config.users, {slack_id: rtmMsg.user})
      if (user.length) {
        const T = createTwitClient(user[0])
        rtmMsg.reaction === config.fav
          ? T.post('favorites/destroy', {id: msg.text.match(/\/([0-9]*)>$/)[1]})
          : T.post(`statuses/unretweet/${msg.text.match(/\/([0-9]*)>$/)[1]}`)
      }
    })
  }
}

exports.on = on
exports.off = off