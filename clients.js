'use strict'
const slack = require('slack-client')
const config = require('./config.js')

const rtm = new slack.RtmClient(config.slack.token)
const web = new slack.WebClient(config.slack.token, {logLevel: 'debug'})

exports.rtm = rtm
exports.web = web
