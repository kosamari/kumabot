'use strict'
const S = require('./clients.js').web

function wantIt () {
  S.chat.postMessage('#hey_write_a_book', "Hey <@mariko>, someone wants you to write a book.", { as_user: true })
}

module.exports = wantIt
