require('dotenv').config();

const { Client, DiscordAPIError, MessageReaction, RichPresenceAssets } = require('discord.js');
const client = new Client();
const PREFIX = "/";
async function vote(addRole, user, member, role) 
{
    const emojis = ['👍', '👎'];
    const channel = client.channels.cache.find(channel => channel.name === "decvotes");
    if (addRole)
    {
        let voteMessage = await channel.send("Голосование за добавление " + user + " в Уважаемый [24 часа]");
        await voteMessage.react(emojis[0]);
        await voteMessage.react(emojis[1]);
        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name);
            };
        const collected = await voteMessage.awaitReactions(filter, { time:5000 }).catch(console.error);
        console.log(collected);
        reactionNames = collected.map(s => reactionNames = s._emoji.name);
        reactionCount = collected.map(s => reactionCount = s.count);
        console.log(reactionNames + " " + reactionCount);
        if (reactionNames.length === 0)
        {
            channel.send("Голосование за добавление " + user + " в Уважаемый не состоялось");
        }
        else if (reactionNames.length === 1)
        {
            if (reactionNames[0] === '👍')
            {
                channel.send(user + " добавлен в Уважаемый!");
                member.roles.add(role.id);
            }
            else
            {
                channel.send(user + " не добавлен в Уважаемый!");
            }
        }
        else if (reactionNames.length === 2)
        {
            if (reactionCount[0] <= reactionCount[1])
            {
                channel.send(user + " не добавлен в Уважаемый!");
            }
            else
            {
                channel.send(user + " добавлен в Уважаемый!");
                member.roles.add(role.id);
            }
        }
    }
    else
    {
        let voteMessage = await channel.send("Голосование за удаление " + user + " из Уважаемый [24 часа]");
        await voteMessage.react(emojis[0]);
        await voteMessage.react(emojis[1]);
        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name);
            };
        const collected = await voteMessage.awaitReactions(filter, { time:5000 }).catch(console.error); //86400000
        console.log(collected);
        reactionNames = collected.map(s => reactionNames = s._emoji.name);
        reactionCount = collected.map(s => reactionCount = s.count);
        console.log(reactionNames + " " + reactionCount);
        if (reactionNames.length === 0)
        {
            channel.send("Голосование за удаление " + user + " из Уважаемый не состоялось");
        }
        else if (reactionNames.length === 1)
        {
            if (reactionNames[0] === '👍')
            {
                channel.send(user + " удален из Уважаемый!");
                member.roles.remove(role.id);
            }
            else
            {
                channel.send(user + " остался в Уважаемый!");
            }
        }
        else if (reactionNames.length === 2)
        {
            if (reactionCount[0] >= reactionCount[1])
            {
                channel.send(user + " остался в Уважаемый!");
            }
            else
            {
                channel.send(user + " удален из Уважаемый!");
                member.roles.remove(role.id);
            }
        }
    }

}
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
            if (message.member.roles.cache.find(r => r.name === "Децибел") || message.author.id === '379293173039759360')
            {
                if (args.length === 0) return message.reply('выберите одну из опций [add, del]');
                let option = args[0];
                if (option === 'add' || option === 'del')
                {
                    if (args.length === 1) return message.reply('выберите одну из ролей [uvajaemiy]');
                    let role = message.member.roles.cache.find(r => r.name === "Уважаемый");
                    if (args.length === 2) return message.reply('укажите пользователя [@...]');
                    var user = message.mentions.members.first();
                    if (user)
                    {
                        const userSet = message.guild.member(user);
                        if (userSet)
                        {
                            var member = message.guild.members.cache.find(member => member.id === userSet.id);
                            if (option === 'add')
                            {
                                if (member.roles.cache.find(r => r.name === "Уважаемый"))
                                {
                                    return message.reply('у указанного пользователя уже есть роль Уважаемый');
                                }
                                vote(true, args[2], member, role);
                            }
                            else
                            {
                                if (!member.roles.cache.find(r => r.name === "Уважаемый"))
                                {
                                    return message.reply('у указанного пользователя и так нет роли Уважаемый');
                                }
                                vote(false, args[2], member, role);
                            }
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