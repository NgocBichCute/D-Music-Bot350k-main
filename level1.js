// const mongo = require('./mongo')
const Levels = require("discord-xp");
Levels.setURL("mongodb://localhost:27017/discordbotDB4"); // You only need to do this ONCE per process.
// Levels.setURL("mongodb://localhost:27017/discordbotDB3");


// const leveCache = {} // { 'guildId-userId': leve }
// const xpCache = {} // { 'guildId-userId': leve }

module.exports = (client) => {
    client.on('message', async(message) => {
        if (!message.guild) return;
        if (message.author.bot) return;
        
        // const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
        const randomAmountOfXp = Math.floor(Math.random() * 9) + 1; // Min 1, Max 30
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

        // const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'goodbye')
        if (hasLeveledUp) {
          const user = await Levels.fetch(message.author.id, message.guild.id);
          message.channel.send(`${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`);
        }
    });
}