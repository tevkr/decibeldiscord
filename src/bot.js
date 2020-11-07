require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "/";

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX))
    {
        const [CMD_NAME, ... args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        
        if (CMD_NAME === 'roll')
        {
            message.reply(Math.floor(Math.random() * Math.floor(100)));
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);