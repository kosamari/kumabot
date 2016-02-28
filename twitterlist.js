const CronJob = require('cron').CronJob
const async = require('async')
const _where = require('lodash.where')
const clients = require('./clients.js')
const T = clients.tw
const S = clients.web
const config = require('./config.js')
var streams = []

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

function openStream () {
  T.get('lists/list', {user_id: config.twitter.user_id}, (_, lists, res) => {
    async.map(config.twitterlist, function createStreams (item, next) {
      T.get('lists/members', { list_id: _where(lists, {name: item.name})[0].id_str, count: 5000 }, (_, data, response) => {
        var users = data.users.map(function (d) { return d.id })
        streams.push({
          channel: item.channel,
          stream: T.stream('statuses/filter', { follow: users.join(',') }),
          users: users
        })
        next()
      })
    }, function listenToStreams (_, results) {
      streams.forEach(item => {
        item.stream.on('tweet', msg => {
          if (filter(item.users, msg.user.id, msg.in_reply_to_user_id, msg.retweeted_status)) {
            S.chat.postMessage(
              item.channel,
              `https://twitter.com/${msg.user.screen_name}/status/${msg.id_str}`,
              { as_user: true }
            )
          }
        })
      })
    })
  })
}

function resetStream () {
  streams.forEach(item => {
    item.stream.stop()
  })
  streams = []
  openStream()
}

function init () {
  new CronJob('00 30 01 * * *', resetStream, null, true, config.timezone)
  openStream()
}

exports.init = init
