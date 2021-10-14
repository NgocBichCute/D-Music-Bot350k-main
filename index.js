const { Collection, Client, Discord } = require('discord.js')
const fs = require('fs')
const welcome1 = require('./welcome1')
const mongo = require('./mongo')
const level1 = require('./level1')
const axios = require('axios');

const Pings = new Collection();

const inviteNotifications = require('./invite-notifications')

const { MessageEmbed } = require("discord.js");

// const mongo = require('./mongo')
// const command = require('./command')
// const welcomeSchema = require('./schemas/welcome-schema')
// const { welcome } = require('./functions/canvasfunctionwcr');
// const discord = require("discord.js");

// const { CanvasSenpai } = require("canvas-senpai")
// const { welcome } = require('./functions/canvasfunctionwc');
// const { welcome } = require('./functions/canvasfunctionwcr');
// const canva = new CanvasSenpai();
const discord = require("discord.js");

// const client = new Client({
//   disableEveryone: true,
//   retryLimit: 5
// })
const client = new Client({ disableMentions: "everyone", retryLimit: 5 });
const config = require('./config.json')
const { e } = require('mathjs')
const prefix = config.prefix
const token = config.token
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

// client.on("guildMemberAdd", (member) => {

//   console.log("some 1 jont!");
// });

// client.on("guildMemberRemove", async member => {
//   const guild = member.guild;
//   // if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
//   console.log("some 1 left!");
// });
// 123213

client.on('ready', async () => {
  client.user.setActivity(`${prefix}help`)
  console.log(`${client.user.username} ✅`)

  // await mongo().then((mongoose) => {
  //   try {
  //     console.log('Connected to mongo!')
  //   } finally {
  //     mongoose.connection.close()
  //   }
  // })
  // client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type : "LISTENING" });
  //CHANGE {type: 2} in 
  //1 FOR PLAYING
  //2 FOR LISTENING
  //3 FOR WATCHING
  client.user.setActivity(`Chúa Hề nè`, { type: 3 });
  welcome1(client)
  level1(client)
  // inviteNotifications(client)
})
client.on('message', async message => {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd)
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args)


})

// client.on('message', async msg => {
//   if (msg.content === 'tst') {
//     // msg.reply('hi bro tui đã check!');
//     msg.channel.send('ók' + msg.channel.id);
//   }
// });

client.on('message', async message => {



  // let messageArray = message.content.split(" ");
  // let args1 = messageArray.slice(1);
  // // let cmd = messageArray[0];
  // var member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args1[0]));

  const { guild, channel } = message

  const user12 = message.mentions.users.first() || message.member.user
  const member = guild.members.cache.get(user12.id)

  // message.channel.send(message.author.tag+`adkjshadkjsahkjhd ${member.user.tag}`);

  if (member.user.tag === 'Obi dâm#3617' && !message.author.bot) {
    // message.reply('hi bro tui đã check!');
    // message.channel.send(message.author.tag+'Bán muốn sữ dụng tôi thử --h'+ message.content );
    message.reply(`Bạn muốn sử dụng tôi hãy xem lệnh bằng câu lênh sau **--h**`);
  }
});

// client.on('message', async msg => {
//   // const aiChannel = '793746676716011530'//aichannel
//   const aiChannel = 'aichannel'//aichannel
//   if (msg.channel.name == aiChannel && !msg.author.bot) {

//     let url1 = `https://simsimi.copcute.pw/api/?text=${encodeURIComponent(msg.content)}&lang=vi_VN`;

//     // url1 = `https://simsimi.copcute.pw/api/?text=${encodeURIComponent(message.content)}&lang=vi_VN`;

//     const res = await axios.get(url1);
//     // if (!checkMsgPerm(message)) return message.author.send('Mình không có quyền gởi tin nhắn ở server này!').catch(err => console.log(`${message.author.id} không mở DMs`));
//     // message.channel.send(!aiLang || aiLang === 'vi' ? res1.data.success : res1.data.cnt);
//     msg.channel.send(res.data.success);

//   }
// });

//Start ai chat ***************

client.on('message', async msg => {

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const args1 = msg.content.slice().trim().split(/ +/g);

  const cat = ''
  const aiChannel = 'aichannel'//aichannel
  const text = args.slice().join(' ')

  // const aiChannel = '793746676716011530'
  const BID = '154399'
  const BRAINKEY = 'eAiW4QXqgyWjUL9k'

  // const aiLang = ``

  if (args1[0] === 'en' || args1[0] === 'En') {

    const aiLang = `en`

    if (msg.channel.name == aiChannel && !msg.author.bot) {

      let url;
      if (!aiLang || aiLang === 'vi') url = `https://simsimi.copcute.pw/api/?text=${encodeURIComponent(text)}&lang=vi_VN`;
      else url = `http://api.brainshop.ai/get?bid=${BID}&key=${BRAINKEY}&uid=1&msg=${encodeURIComponent(text)}`;
      const res = await axios.get(url);
      // if (!checkMsgPerm(msg)) return msg.author.send('Mình không có quyền gởi tin nhắn ở server này!').catch(err => console.log(`${msg.author.id} không mở DMs`));
      msg.channel.send(!aiLang || aiLang === 'vi' ? res.data.success : res.data.cnt);
      // msg.channel.send(args.slice().join(' '));
      // msg.channel.send(aiLang + text);
      // msg.channel.send(args1[0]);

    }
  }
  else {

    const aiLang = `vi`

    if (msg.channel.name == aiChannel && !msg.author.bot) {

      let url;
      if (!aiLang || aiLang === 'vi') url = `https://simsimi.copcute.pw/api/?text=${encodeURIComponent(msg.content)}&lang=vi_VN`;
      else url = `http://api.brainshop.ai/get?bid=${BID}&key=${BRAINKEY}&uid=1&msg=${encodeURIComponent(msg.content)}`;
      const res = await axios.get(url);
      // if (!checkMsgPerm(msg)) return msg.author.send('Mình không có quyền gởi tin nhắn ở server này!').catch(err => console.log(`${msg.author.id} không mở DMs`));
      msg.channel.send(!aiLang || aiLang === 'vi' ? res.data.success : res.data.cnt);
      // msg.channel.send(args.slice().join(' '));
      // msg.channel.send(aiLang + text);
      // msg.channel.send(args1[0]);

    }
  }
  // const aiLang = `${msg[0]}`
  // if (msg.channel.name == aiChannel && !msg.author.bot) {

  //   let url;
  //   if (!aiLang || aiLang === 'vi') url = `https://simsimi.copcute.pw/api/?text=${encodeURIComponent(text)}&lang=vi_VN`;
  //   else url = `http://api.brainshop.ai/get?bid=${BID}&key=${BRAINKEY}&uid=1&msg=${encodeURIComponent(text)}`;
  //   const res = await axios.get(url);
  //   // if (!checkMsgPerm(msg)) return msg.author.send('Mình không có quyền gởi tin nhắn ở server này!').catch(err => console.log(`${msg.author.id} không mở DMs`));
  //   msg.channel.send(!aiLang || aiLang === 'vi' ? res.data.success : res.data.cnt);
  //   // msg.channel.send(args.slice().join(' '));
  //   // msg.channel.send(aiLang + args1[0]);
  //   // msg.channel.send(args1[0]);

  // }
});

//End ai chat *************

const channelId = '768377537834254338' // welcome channel 717168653300269119
const targetChannelId = '761989109337554964'

// client.on("guildMemberAdd", member => {
//     console.log("someone joined!");
//     // const channel = member.guild.channels.cache.get(channelId)
//     welcome1(client)

//     // channel.send('Hello123');
// })

// client.on("guildMemberRemove", member => {
//     const channel = member.guild.channels.cache.get(channelId)
//     console.log("someone left!");
//     channel.send(`bye 1 bạn ${member.user.tag}`)
// })







// client.on('message', async (message) => {
//   if (message.author.bot) return;
//   let substringArray = get_substrings_between(message.content, ":",":");
//   let msg = message.content;
//   if(!substringArray.length) return;

//   substringArray.forEach(m => {
//     let emoji = client.emojis.cache.find(x => x.name === m);
//     var replace = `:${m}:`;
//     var rexreplace = new RegExp(replace, 'g');

//     if(emoji && !msg.split(" ").find(x => x === emoji.toString()) && !msg.includes(`<a${replace}${emoji.id}>`)) msg = msg.replace(rexreplace, emoji.toString());
//   });

//   if(msg ===  message.content) return;

//   let webhook = await message.channel.fetchWebhooks();
//   webhook = webhook.find(x => x.name === "NQN34567́9");

//   if(!webhook){
//     webhook = await message.channel.createWebhook(`NQN34567́9`,{
//       avatar: client.user.displayAvatarURL({dynamic: true})
//     });
//   }

//   await webhook.edit({
//     name: message.member.nickname ? message.member.nickname : message.author.username,
//     avatar: message.author.displayAvatarURL({dynamic: true})
//   })

//   // message.delete().cache(m => {})

//   webhook.send(msg).catch(m => {});
//   message.delete().cache(m => {})

//   await webhook.edit({
//     name: `NQN34567́9`,
//     avatar: client.user.displayAvatarURL({dynamic:true})
//   })

// });



// //-----------------------------------Funtion-----------------------------------------------------

// function get_substrings_between(str, starDelimiter, endDelimiter){

//   var contents = [];
//   var starDelimiterLength = starDelimiter.length;
//   var endDelimiterLength = endDelimiter.length;
//   var startFrom = contentStart = contentEnd = 0;

//   while (false !== (contentStart = strpos(str, starDelimiter, startFrom))){
//     contentStart += starDelimiterLength;
//     contentEnd = strpos(str, endDelimiter, contentStart);
//     if(false == contentEnd){
//       break;
//     }

//     contents.push(str.substr(contentStart, contentEnd - contentStart));
//     startFrom = contentEnd + endDelimiterLength;

//   }

//   return contents;
// }

// function strpos(haystack, needle, offset){
//   var i = (haystack + '').indexOf(needle, (offset || 0));
//   return i === -1 ? false : i;
// }


// //---------------------------------------End Funtion---------------------------------------------




client.on("message", async message => {
  if (!message.mentions.members.first()) return;
  if (message.mentions.members.first().id === message.author.id) return;
  const time = 5000;
  Pings.set(`pinger:${message.author.id}`, Date.now() + time);

  setTimeout(() => {
    Pings.delete(`pinger:${message.mentions.members.first().id}`);
  }, time);

});

client.on("messageDelete", message => {
  if (!message.mentions.members.first()) return;
  // if (Pings.has(`pinger:${message.mentions.members.first().id}`)) {
  //   console.log(2);
  //   message.channel.send(
  //     new MessageEmbed()
  //       .setTitle("PHÁT HIỆN PING!")
  //       .addField("Tác giả", message.author, true)
  //       .addField("ConteFnt", message.content, true)
  //       .setColor("RANDOM")
  //       .setTimestamp()
  //   );
  // }

  if (message.mentions.members.first() != '') {
    // message.reply('hi bro tui đã check!');
    // message.channel.send(message.author.tag+'Bán muốn sữ dụng tôi thử --h'+ message.content );
    message.reply(
      new MessageEmbed()
        .setTitle("PHÁT HIỆN PING!")
        .addField("Tác giả", message.author, true)
        .addField("ConteFnt", message.content, true)
        .setColor("RANDOM")
        .setTimestamp()
    )
  }

});


/// starboard start
let idsvss = '717168653300269116' 
let idcnss = '717168653300269119'


// client.on("messageReactionAdd", async (reaction, user) => {
client.on('messageReactionAdd', async (reaction, user) => {

  if (reaction.message.channel.type === "dm") return; //Skip DM.
  if (reaction.message.partial) await reaction.message.fetch(true);
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.author.bot || user.bot) return;

  let starboardChannel = reaction.message.guild.channels.cache.get(idcnss);
  let starboardFetch = await starboardChannel.fetch({ limit: 100 });

  let exist = starboardFetch.messages.cache
    .find(m => m.embeds.length >= 1 && m.embeds[0].title === "👍 Like" && m.embeds[0].fields[0].value.match(reaction.message.id));

  if (exist) return;

  if (reaction.message.guild.id == idsvss) {
    if (reaction.emoji.name === "👍") {
      let count = reaction.users.cache.filter(x => reaction.message.author.id !== x.id && !x.bot).array().length;

      if (count >= 5) {
        console.log('loghinh like')
        const embed = new MessageEmbed()
          .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL({ dynamic: true }))
          .setTitle("👍 Like")
          .setDescription(reaction.message.content.length <= 0 ? "" : reaction.message.content)
          .addField("Original Content", `[Jump to Message](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`)
          .setColor(0x7289DA)

        if (reaction.message.attachments.array().length >= 1) embed.setImage(reaction.message.attachments.array()[0].proxyURL);

        starboardChannel.send(embed);

      }
    }
  }

})



///starboard End


client.login(token)