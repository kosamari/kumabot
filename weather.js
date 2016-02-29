'use strict'
const http = require('http')
const CronJob = require('cron').CronJob
const config = require('./config.js')
const weather = config.weather
const S = require('./clients.js').web
const base_url = 'http://api.openweathermap.org/data/2.5'

function toC (k) {
  return Math.round((k - 273.15) * 10) / 10
}

function toF (k) {
  return Math.round(((k * 1.8) - 459.7) * 10) / 10
}

function getDayForcast (city, cb) {
  city = city || weather.city
  http.get(`${base_url}/forecast/daily?q=${city}&cnt=1&appid=${weather.api_key}`, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      cb(null, JSON.parse(data))
    })
  }).on('error', (err) => {
    cb(err, `Got error: ${err.message}`)
  })
}

function getCurrentWeather (city, cb) {
  city = city || weather.city
  http.get(`${base_url}/weather?q=${city}&appid=${weather.api_key}`, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      cb(null, JSON.parse(data))
    })
  }).on('error', (err) => {
    cb(err, `Got error: ${err.message}`)
  })
}

function findLocation (text) {
  const arr = text.split(' ')
  const index = arr.indexOf('in') + 1
  return arr.splice(index, arr.length - index).join(' ').replace(/\?/g, '').trim()
}

function current (city, channel) {
  getCurrentWeather(city, function (_, data) {
    const loc = city ? data.name : weather.city
    S.chat.postMessage(channel,
      `It's *${data.weather[0].description}* in ${loc} & temperature outside is *${toC(data.main.temp)}C/${toF(data.main.temp)}F*`,
      {as_user: true}
    )
  })
}

function today (city, channel) {
  getDayForcast(city, function (_, data) {
    const loc = city ? data.city.name : weather.city
    S.chat.postMessage(channel,
      `Today's forecast in ${loc} is *${data.list[0].weather[0].description} (${toC(data.list[0].temp.day)}C/${toF(data.list[0].temp.day)}F)*`,
      {as_user: true}
    )
  })
}

function dailyMorning () {
  getCurrentWeather(null, function (_, data) {
    S.chat.postMessage('#general',
      `Good morning! :sun_with_face: It's *${data.weather[0].description}* in ${weather.city} & temperature outside is *${toC(data.main.temp)}C/${toF(data.main.temp)}F*`,
      {as_user: true}
    )
  })
}

function reply (text, channel) {
  if (text.includes('weather')) {
    if (text.includes(' in ')) {
      return current(findLocation(text), channel)
    }
    if (text.includes('weather now')) {
      return current(null, channel)
    }
  }
  if (text.includes('hot') || text.includes('cold')) {
    if (text.includes(' in ')) {
      return current(findLocation(text), channel)
    }
    if (text.includes('is it')) {
      return current(null, channel)
    }
  }
  if (text.includes('forecast')) {
    if (text.includes(' in ')) {
      return today(findLocation(text), channel)
    }
    if (text.includes('forecast today')) {
      return today(null, channel)
    }
  }
}

function init () {
  new CronJob('00 30 08 * * *', dailyMorning, null, true, config.timezone)
}

exports.reply = reply
exports.init = init
