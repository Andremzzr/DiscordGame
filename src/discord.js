const { Client, Intents } = require('discord.js');

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

    

    const {username} = message.author;
    if(players.length == 0){
        if(message.content == '$points'){
            message.reply("You don't have any points");
        }
        else{
            players.push({
                username,
                points : message.content.length
            });
    
            console.log(players);
        }
        

    }
     else{  
    
        if(message.content == '$points'){
            for (let i = 0; i < players.length; i++) {
                const element = players[i];
                if(message.author.username == element.username){
                    message.reply(`You have ${element.points} points`);
                }
                else{
                    message.reply("You don't have any points");
                }
                
            }
        }
        else{
            for (let i = 0; i < players.length; i++) {
                const listName = players[i].username;
                if(listName == username){
                    players[i].points += message.content.length;
                }
                else{
                    players.push({
                        username,
                        points : message.content.length
                    });
            
                    console.log(players);
                }
                
            }

        }
        
    

    

    }
})







client.login(process.env.DISCORD_TOKEN);
