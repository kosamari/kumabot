module.exports = {
  slack: {
    token: 'xoxb-23411951478-dRSFm5ZNvy7k2fxMw5v9aFw7',
    admin: 'U064G4F25',
    bot: 'U0PC3TZE2',
    log: '#kumalog'
  },
  weather: {
    api_key: 'da56c49ac4b0e5a866431aa81ed36f8a',
    city: 'Ridgewood,NY',
    zipcode: '11385'
  },
  twitter_reaction: {
    fav: 'heart',
    rt: 'repeat',
    users: [
      {
        slack_id: 'U064G4F25',
        tw_credential: {
          consumer_key: 'tKW9PJ8nbfyFgJcCtbRIoTjH1',
          consumer_secret: 'bgkAGNNPlfBIoV3wFOhzmKp7sX4FxoltQUUC8PuR8TpTDUbmfu',
          access_token: '8470842-ZBwCpi63WjlhBzIwUGVxuoPKlumyOoj2kxZXo8Cpe9',
          access_token_secret: '36LgYMmEaVV9Rdt1jKBVPqJaeUUZrxI3MY4HuGO66q7Ml'
        }
      }
    ]
  },
  twitter_list: {
    credential: {
      consumer_key: 'tKW9PJ8nbfyFgJcCtbRIoTjH1',
      consumer_secret: 'bgkAGNNPlfBIoV3wFOhzmKp7sX4FxoltQUUC8PuR8TpTDUbmfu',
      access_token: '8470842-ZBwCpi63WjlhBzIwUGVxuoPKlumyOoj2kxZXo8Cpe9',
      access_token_secret: '36LgYMmEaVV9Rdt1jKBVPqJaeUUZrxI3MY4HuGO66q7Ml',
      user_id: '8470842'
    },
    lists: [
      {
        name: 'horse',
        channel: '#horse'
      },
      {
        name: 'JS',
        channel: '#js'
      },
      {
        name: 'textile',
        channel: '#textile'
      },
      {
        name: 'art_and_design',
        channel: '#art_and_design'
      },
      {
        name: 'data_and_art',
        channel: '#data_and_art'
      }
    ]
  },
  reminder: [
    {
      channel: '#general',
      comment: '<!channel> Time to see Jon yet again! Get :moneybag: ready.',
      cron_time: '0 0 10 1 * *'
    },
    {
      channel: '#general',
      comment: '<!channel> Pay your :credit_card: bill! ',
      cron_time: '0 0 10 3 * *'
    }
  ],
  timezone: 'America/New_York'
}
