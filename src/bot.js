require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "/";

client.on('message', async message => {
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
        if (CMD_NAME === 'rolevote')
        {
            if (message.member.roles.find(r => r.name === "Децибел"))
            {
                if (args.length === 0) return message.reply('выберите одну из опций [add, del]');
                let option = args[0];
                if (option === 'add' || option === 'del')
                {
                    if (args.length === 1) return message.reply('выберите одну из ролей [uvajaemiy]');
                    let role = message.guild.roles.find(role => role.name === "Уважаемый");
                    if (args.length === 2) return message.reply('укажите пользователя [@...]');
                    let user = message.mentions.users.first();
                    if (user)
                    {
                        const member = message.guild.member(user);
                        if (option === 'add')
                        {
                            member.roles.add(role);
                        }
                        else
                        {
                            member.roles.remove(role);
                        }
                    }
                    else
                    {
                        return message.reply('указанный пользователь не найден');
                    }
                }
                else
                {
                    return message.reply('вы выбрали несуществующую опцию! Используйте add или del');
                }
            }
            else
            {
                return message.reply('у вас нет прав для выполнения данной команды!');
            }
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);