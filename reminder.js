'use strict'
const CronJob = require('cron').CronJob
const reminder = require('./config.js').reminder
const S = require('./clients.js').web

function init () {
  reminder.map(item => new CronJob(item.cron_time, () => S.chat.postMessage(item.channel, item.comment, { as_user: true }), null, true, 'America/New_York'))
}

exports.init = init
