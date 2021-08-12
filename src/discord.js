const { Client, Intents, MessageActionRow } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";

require('dotenv').config();

let players = [];


client.once('ready', () => {
	console.log(`Bot online: ${client.user.username}`);
});



client.on("message", message => {
    if(message.author.bot) return ;
    if(message.content.length == 0) return;

    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ... args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if(CMD_NAME == 'points'){
            if(players.length == 0){
                message.reply(`You don't have any points`)
            }
            else{
                const user = players.find( player => player.username == message.author.username);
                if(user != undefined) {
                    message.reply(`You have ${user.points} points`);
                }
                else{
                    message.reply("You dont have any points");
                }
            }
        }

        

    }
    else{
        if(players.length == 0){
            players.push({
                username: message.author.username,
                points: message.content.length
            })
            console.log(players);
        }
        else{
            const user = players.find( player => player.username == message.author.username);
            user.points += message.content.length;
            console.log(players);

        }
    }

})







client.login(process.env.DISCORD_TOKEN);
