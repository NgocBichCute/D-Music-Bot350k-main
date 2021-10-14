// const mongo = require('./mongo')
// const command = require('./command')
// const welcomeSchema = require('./schemas/welcome-schema')
const mongo = require('./mongo')
const command = require('./command')
const welcomeSchema = require('./schemas/welcome-schema')
const { welcome } = require('./functions/canvasfunctionwcr');
const discord = require("discord.js");


module.exports = (client) => {
  //!setwelcome <message>
  const cache = {} // guildId: [channelId, text]

  command(client, 'sw', async (message) => {
    const { member, channel, content, guild } = message

    // if (!member.hasPermission('ADMINISTRATOR')) {
    //   channel.send('You do not have permission to run this command.')
    //   return
    // }

    let text = content
    const lang = message.content.slice(prefix.length).trim().split(' ');
    const lang123 = lang[1]

    const split = text.split(' ')

    if (split.length < 2) {
      channel.send('Please provide a welcome message')
      return
    }

    split.shift()
    // text = split.join(' ')
    text = split.slice(1).join(' ')

    // cache[guild.id] = [channel.id, text]
    cache[guild.id] = [lang123, text]

    await mongo().then(async (mongoose) => {
      try {
        await welcomeSchema.findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            _id: guild.id,
            channelId: lang123,
            text,
          },
          {
            upsert: true,
          }
        )
      } finally {
        mongoose.connection.close()
      }
    })
  })

  const onJoin = async (member) => {
    const { guild } = member

    let data = cache[guild.id]

    if (!data) {
      console.log('FETCHING FROM DATABASE')

      await mongo().then(async (mongoose) => {
        try {
          const result = await welcomeSchema.findOne({ _id: guild.id })

          cache[guild.id] = data = [result.channelId, result.text]
        } finally {
          mongoose.connection.close()
        }
      })
    }

    const channelId = data[0]
    const text = data[1]

    const channel = guild.channels.cache.get(channelId)

    const image = await welcome(member.user.username, member.user.discriminator, member.user.displayAvatarURL({ format: 'png', dynamic: false }), member.guild.memberCount);
    const attachment = new discord.MessageAttachment(
      image,
      "welcome-image.png"
    );

    // return channel.send(attachment);
    // channel.send(`123${channel}`);
    channel.send(attachment);
    channel.send(text.replace(/<@>/g, `<@${member.id}>`))

  }


  const onOut = async (member) => {
    const { guild } = member

    let data = cache[guild.id]

    if (!data) {
      console.log('FETCHING FROM DATABASE')

      await mongo().then(async (mongoose) => {
        try {
          const result = await welcomeSchema.findOne({ _id: guild.id })

          cache[guild.id] = data = [result.channelId, result.text]
        } finally {
          mongoose.connection.close()
        }
      })
    }

    const channelId = data[0]
    const text = data[1]

    const channel = guild.channels.cache.get(channelId)

    channel.send(`Good bye ${member} It Out Server`);
    // channel.send(text.replace(/<@>/g, `<@${member.id}>`))

  }

  command(client, 'sim1', (message) => {
    onJoin(message.member)
  })

  // client.on('guildMemberAdd', (member) => {
  //   console.log('Some 1 joinn')
  //   onJoin(member)
  // })
  client.on('guildMemberAdd', async member => {
    // const serverdata = db.get(member.guild.id);
    // if (!db.has(`${member.guild.id}.welcomechannel`)) return;
    // const channel = member.guild.channels.cache.get(serverdata.welcomechannel);
    // if (!channel) return;
    // const image = await welcome(member.user.username, member.user.discriminator, member.user.displayAvatarURL({ format: 'png', dynamic: false }), member.guild.memberCount);
    // const attachment = new MessageAttachment(image, 'welcome.png');
    console.log('Some 1 joinn')
    //   onJoin(member)

    // let role = message.guild.roles.cache.find(role => role.name === "Girl");
    // member.roles.add(role.id);
    return onJoin(member);
  });

  client.on("guildMemberRemove", async member => {
    // message.channel.send(`Tạm biệt ${member}`)
    return onOut(member);
  });
}
