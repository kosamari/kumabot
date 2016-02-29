'use strict'
const bunyan = require('bunyan')
module.exports = bunyan.createLogger({
  name: 'kumabot',
  streams: [
    {
      level: 'warn',
      path: './kumabot.log'
    },
    {
      level: 'debug',
      stream: process.stdout
    }
  ]
})
