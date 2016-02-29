'use strict'
const Twit = require('twit')
const slack = require('slack-client')
const config = require('./config.js')

const tw = new Twit(config.twitter)
const rtm = new slack.RtmClient(config.slack.token)
const web = new slack.WebClient(config.slack.token, {logLevel: 'debug'})

exports.tw = tw
exports.rtm = rtm
exports.web = web
