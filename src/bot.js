require('dotenv').config();

const { Client, DiscordAPIError, MessageReaction, RichPresenceAssets } = require('discord.js');
const client = new Client();
const PREFIX = "/";
var currentVote =  new Array();
async function vote(addRole, user, member, role, author) 
{
    const emojis = ['👍', '👎'];
    const channel = client.channels.cache.find(channel => channel.name === "decvotes");
    if (addRole)
    {
        let voteMessage = await channel.send("Голосование за добавление " + user + " в Уважаемый [1 час]. Автор: " + author);
        await voteMessage.react(emojis[0]);
        await voteMessage.react(emojis[1]);
        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name);
            };
        const collected = await voteMessage.awaitReactions(filter, { time:3600000 }).catch(console.error); //86400000
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
        let voteMessage = await channel.send("Голосование за удаление " + user + " из Уважаемый [1 час]. Автор: " + author);
        await voteMessage.react(emojis[0]);
        await voteMessage.react(emojis[1]);
        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name);
            };
        const collected = await voteMessage.awaitReactions(filter, { time:3600000 }).catch(console.error);
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
    currentVote.splice(currentVote.indexOf(member.id), 1);
    console.log(currentVote);
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
                const channel = client.channels.cache.find(channel => channel.name === "decvotes");
                if (args.length === 0)
                {
                    message.delete();
                    return channel.send("<@!" + message.author.id + "> выберите одну из опций [add, del]");
                }
                let option = args[0];
                if (option === 'add' || option === 'del')
                {
                    if (args.length === 1)
                    {
                        message.delete();
                        return channel.send("<@!" + message.author.id + "> выберите одну из ролей [uvajaemiy]");
                    }
                    let role = message.member.roles.cache.find(r => r.name === "Уважаемый");
                    if (args.length === 2)
                    {
                        message.delete();
                        return channel.send("<@!" + message.author.id + "> укажите пользователя [@...]");
                    } 
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
                                    return channel.send("<@!" + message.author.id + "> у указанного пользователя уже есть роль Уважаемый");
                                }
                                message.delete();
                                if (currentVote.indexOf(member.id) === -1)
                                {
                                    currentVote.push(member.id);
                                    vote(true, args[2], member, role, message.author.username);
                                }
                                else
                                {
                                    channel.send("Голосование за " + args[2] + " уже идет!");
                                }
                            }
                            else
                            {
                                if (!member.roles.cache.find(r => r.name === "Уважаемый"))
                                {
                                    return channel.send("<@!" + message.author.id + "> у указанного пользователя уже есть роль Уважаемый");
                                }
                                message.delete();
                                if (currentVote.indexOf(member.id) === -1)
                                {
                                    console.log(currentVote);
                                    currentVote.push(member.id);
                                    console.log(currentVote);
                                    vote(false, args[2], member, role, message.author.username);
                                }
                                else
                                {
                                    channel.send("Голосование за " + args[2] + " уже идет!");
                                }
                            }
                        }
                    }
                    else
                    {
                        message.delete();
                        return channel.send("<@!" + message.author.id + "> указанный пользователь не найден");
                    }
                }
                else
                {
                    message.delete();
                    return channel.send("<@!" + message.author.id + "> вы выбрали несуществующую опцию! Используйте add или del");
                }
            }
            else
            {
                message.delete();
                return channel.send("<@!" + message.author.id + "> у вас нет прав для выполнения данной команды!");
            }
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);