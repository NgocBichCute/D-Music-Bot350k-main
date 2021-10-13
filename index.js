console.clear()
console.log("[INFO]: BOT MẪU GIÁ 350K...")
const { Client, Collection } = require('discord.js');
const db = require('quick.db')
Discord = require("discord.js");
const config = require("./config.json");
const { token } = require('./config.json');
const { default_prefix } = require('./config.json');
const { readdirSync } = require('fs');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { CHANNELID } = require('./config.json');
const picExt = [".webp", ".png", ".jpg", ".jpeg", ".gif"];
const videoExt = [".mp4", ".webm", ".mov"];
const client = new Client({
    disableMentions: 'everyone'
});
const moment = require("moment")
const guildInvites = new Map();
const ms = require('ms');

const setups = require("./handlers/setups");
setups(client);

client.on('inviteCreate', async inivte => {
    const channel = inivte.guild.channels.cache.get('838466405577392140');
    if (channel) {
        const embed = new MessageEmbed()
            .setTitle(`Có link invite mới được tạo!`)
            .addField('Người tạo', inivte.inviter.tag)
            .setFooter(`ID: ${inivte.inviter.id}`)
            .addField('Số lượng: ', inivte.maxUses == 0 ? "Không giới hạn" : inivte.maxUses)
            .addField('Thời hạn của link: ', inivte.maxAge == 0 ? "Không giới hạn" : ms(inivte.maxAge, { long: true }))
            .setTimestamp()
        channel.send(embed)
    }
    guildInvites.set(inivte.guild.id, await inivte.guild.fetchInvites())
});

const { GiveawaysManager } = require("discord-giveaways");
// Starts updating currents giveaways
client.giveawaysManager = new GiveawaysManager(client, {
 storage: "./handlers/giveaways.json",
 updateCountdownEvery: 5000,
 default: {
 botsCanWin: false,
 embedColor: "#FF0000",
 reaction: "🎉"
 }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
 console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
 console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
 console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});
 

const welcome = require("./welcome");
welcome(client);
client.commands = new Collection();
client.aliases = new Collection();
client.queue = new Map();
client.categoryes = readdirSync(`./commands/`);

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


client.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const channel = member.guild.channels.cache.get('838466405577392140');
        if (channel) {
            const embed = new MessageEmbed()
                .setDescription(`${member} (${member.user.tag}) đã vào server!\nMời bởi \`${usedInvite ? usedInvite.inviter.tag : "Không xác định được"}\``)
                .setFooter(`ID người vào: ${member.id}`)
                .setTimestamp()
            channel.send(embed)
        }
    }
    catch(err) {
        console.log(err);
    }
})

client.on('message', async message => {
    const prefix = '&';
    if (message.author.bot) return;
    let choosePrefix = null;
    const prefixList = [`<@${client.user.id}>`, `<@!${client.user.id}>`, prefix];
    for (const thisprefix of prefixList) {
        if (message.content.toLowerCase().startsWith(thisprefix)) choosePrefix = thisprefix
    }
    if (prefix === null) return;
    if (!message.content.startsWith(choosePrefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    switch(cmd) {
        case 'invite': {
            if (!args[0]) return message.channel.send('VD: `&invite 3n 5m`\n3n = 3 người, 5m = 5 phút');
            let songuoi = args[0];
            if (!songuoi.endsWith('n')) return message.channel.send('Nhập số người invite (0n để không giới hạn)');
            songuoi = parseInt(args[0].replace('n', ''));
            let thoigian = args[1];
            if (thoigian !== 0) thoigian = ms(thoigian);
            if (!thoigian) return message.channel.send('Thời gian không hợp lệ!');
            let sanhchung = message.guild.channels.cache.get('838466405577392140');
            if (!sanhchung) return message.channel.send('Không tìm thấy channel sảnh chung!');
            let inv = await sanhchung.createInvite({ maxAge: thoigian, maxUses: songuoi });
            message.author.send(`Link invite của bạn: ${inv.url}`);
        }
    }
})
// Invite
client.on("message", async message => {
   

    if (message.author.bot) return;
    if (!message.guild) return;
  let prefix = db.get(`prefix_${message.guild.id}`)
  if(prefix === null) prefix = default_prefix;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) 
        command.run(client, message, args, db); // thêm "db" nếu về sau sử dụng mà có lỗi thì xoá db và welcome 
});

// Confession 
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'dm') return;
    if (message.content.length > 1024) return message.channel.send('tin nhắn chỉ được dưới 1024 ký tự!');
    else {
        await message.react("🙂");
        message.channel.send('\`đã gửi confession thành công\`');
        let count = JSON.parse(fs.readFileSync('./assets/json/count.json')).count;
        count++;
        const cfschannel = client.channels.cache.get(CHANNELID);
        if (!cfschannel) return;
        const embed = new MessageEmbed()
            .setTitle(`**Confession: #${count}**`)
            .setDescription(`${message.content}`)
            .setColor("RANDOM") //
            .setTimestamp() //
            .setFooter(`Code by vinh`)
            if (message.attachments.array().length > 0) {
                let attachment = message.attachments.array()[0];
        picExt.forEach(ext => {
            if (attachment.name.endsWith(ext)) embed.setImage(attachment.attachment);
        });
        videoExt.forEach(ext => {
            if (attachment.name.endsWith(ext)) cfschannel.send(attachment);
        });
        }
        cfschannel.send(embed);
        fs.writeFileSync('./assets/json/count.json', JSON.stringify({ count: count }));
    }
});

client.login(token);
