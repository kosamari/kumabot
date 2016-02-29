module.exports = {
  slack: {
    token: '',
    admin: '', // in id like U0123456
    bot: '',   // in id like U0123456
    log: ''    // name of channel starting with #
  },
  weather: {
    api_key: '',
    city: 'NewYork',
    zipcode: '10007'
  },
  twitterlist: {
    credential: {
      consumer_key: '',
      consumer_secret: '',
      access_token: '',
      access_token_secret: '',
      user_id: ''// in digits like 123456
    },
    lists: [
      {
        name: 'name', // name of Twitter list
        channel: '#name' // name of Slack channel starting with #
      }
    ]
  },
  reminder: [
    {
      channel: '#general', // name of Slack channel starting with #
      comment: '<!channel> comment', // comment to post
      cron_time: '0 0 10 1 * *' // cron job time string
    }
  ],
  timezone: 'America/New_York' // timezone string for cron job
}
