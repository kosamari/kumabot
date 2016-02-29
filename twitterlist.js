'use strict'
const CronJob = require('cron').CronJob
const async = require('async')
const _where = require('lodash.where')
const _uniq = require('lodash.uniq')
const Twit = require('twit')

const clients = require('./clients.js')
const S = clients.web
const config = require('./config.js').twitterlist
const log = require('./logger.js')
const kao = require('./kaomoji.js').random
const slacklog = require('./config.js').slack.log

const T = new Twit(config.credential)
let stream

function filter (list, userId, replyto, rt) {
  if (list.indexOf(userId) > -1) {
    if (rt && list.indexOf(rt.user.id) > -1) {
      return false
    } else if (replyto === null || list.indexOf(replyto) > -1) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

function arrayEquals (newArray, oldArray) {
  if (!oldArray) {
    oldArray = []
  }
  if (newArray.length !== oldArray.length) {
    return false
  }
  return newArray.map((d) => oldArray.indexOf(d) > -1 ? 0 : 1).reduce((p, n) => p + n) === 0
}

function start () {
  T.get('lists/list', {}, (_, lists, res) => {
    async.map(config.lists, function createStreams (item, next) {
      T.get('lists/members', { list_id: _where(lists, {name: item.name})[0].id_str, count: 5000 }, (_, data, response) => {
        var users = data.users.map(function (d) { return d.id_str })
        if (arrayEquals(users, item.users)) {
          return next(null, false)
        }
        item.users = users
        return next(null, true)
      })
    }, function openStream (_, results) {
      if (results.reduce((p, n) => p + n ) > 0) {
        if (stream) { stream.stop() }
        stream = T.stream('statuses/filter', { follow: _uniq(config.lists.map(i => i.users).reduce((p, n) => p.concat(n))).join(',') })
        stream.on('connected', function (response) {
          log.debug(`Connected to Twitter stream`)
          S.chat.postMessage(
            slacklog,
            `${kao()} Connected to Twitter stream`,
            { as_user: true }
          )
        })
        stream.on('reconect', function (response) {
          console.log('recconecting yo')
        })
        stream.on('disconnect', function (disconnectMessage) {
          log.warn(`lost connection to Twitter`)
          S.chat.postMessage(
            slacklog,
            `${kao()} Disconnected from Twitter stream`,
            { as_user: true }
          )
        })
        stream.on('tweet', msg => {
          config.lists.map((item) => {
            if (filter(item.users, msg.user.id_str, msg.in_reply_to_user_id_str, msg.retweeted_status) && item.last_id !== msg.id_str) {
              item.last_id = msg.id_str
              S.chat.postMessage(
                item.channel,
                `https://twitter.com/${msg.user.screen_name}/status/${msg.id_str}`,
                { as_user: true }
              )
            }
          })
        })
      }
    })
  })
}

function init () {
  new CronJob('00 30 1 * * *', start, null, true, config.timezone)
  start()
}

exports.init = init
