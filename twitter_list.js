'use strict'
const CronJob = require('cron').CronJob
const async = require('async')
const _where = require('lodash.where')
const _uniq = require('lodash.uniq')
const Twit = require('twit')
const clients = require('./clients.js')
const S = clients.web
const config = require('./config.js').twitter_list
const log = require('./logger.js')
const kao = require('./kaomoji.js').random
const slacklog = require('./config.js').slack.log

const T = new Twit(config.credential)
let stream

function filter (msg, item) {
  const userList = item.users.map(d => d.id)
  const mention = msg.text.match(/^@([a-zA-Z0-9_]{1,15})/)
  const rt = msg.retweeted_status
  if (userList.indexOf(msg.user.id_str) > -1) {
    if (rt) {
      if (userList.indexOf(rt.user.id) > -1) {
        return false
      }
      return true
    }
    if (mention) {
      if (_where(item.users, { name: mention[1] }).length) {
        return true
      }
      return false
    }
    return true
  }
  return false
}

function arrayEquals (newArray, oldArray) {
  if (newArray.length !== oldArray.length) {
    return false
  }
  return newArray.map((d) => oldArray.indexOf(d) > -1 ? 0 : 1).reduce((p, n) => p + n) === 0
}

function start () {
  T.get('lists/list', {}, (_, lists, res) => {
    async.map(config.lists, function createStreams (item, next) {
      T.get('lists/members', { list_id: _where(lists, {name: item.name})[0].id_str, count: 5000 }, (_, data, response) => {
        const newList = data.users.map(d => d.id_str)
        const oldList = item.users ? item.users.map(d => d.id) : []
        if (arrayEquals(newList, oldList)) {
          return next(null, false)
        }
        item.users = data.users.map(d => {
          return {
            id: d.id_str,
            name: d.screen_name
          }
        })
        return next(null, true)
      })
    }, function openStream (_, results) {
      if (results.reduce((p, n) => p + n) > 0) {
        if (stream) { stream.stop() }
        stream = T.stream('statuses/filter', { follow: _uniq(config.lists.map(d => d.users.map(d => d.id)).reduce((p, n) => p.concat(n))).join(',') })
        stream.on('connected', response => {
          log.debug(`Connected to Twitter stream`)
          S.chat.postMessage(
            slacklog,
            `${kao()} Connected to Twitter stream`,
            { as_user: true }
          )
        })
        stream.on('disconnect', disconnectMessage => {
          log.warn(`lost connection to Twitter`)
          S.chat.postMessage(
            slacklog,
            `${kao()} Disconnected from Twitter stream`,
            { as_user: true }
          )
        })
        stream.on('tweet', msg => {
          config.lists.map((item) => {
            if (filter(msg, item) && item.last_id !== msg.id_str) {
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
exports.restart = start
