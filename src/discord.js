const { Client, Intents, MessageActionRow } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";

require('dotenv').config();

let players = [];
const pokemon = require('./pokemon.js');

client.once('ready', () => {
	console.log(`Bot online: ${client.user.username}`);
});



client.on("message", async (message) => {
    if(message.author.bot) return ;
    if(message.content.length == 0) return;

    
    const user = players.find( player => player.username == message.author.username);


    // HANDLE COMMANDS
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if(CMD_NAME == 'points'){
            if(players.length == 0){
                message.reply(`You don't have any points`)
            }
            else{
               user != undefined ? message.reply(`You have ${user.points} points`) :  message.reply("You dont have any points")
            }
        }
        else if(CMD_NAME == 'buyPokeBall' && args > 0){
           
            if(user == undefined){
                message.reply("You don't have any points")
            }
            else{
            if(user.points >= 10 * args){
                user.points -= 10 * args;
                user.pokeball+= args;
                message.reply(`Congrats, you bought ${args} pokeball(s) :D`);
            }
            else{
                message.reply(`You have only ${user.points} points, you need to get more to buy a pokeball`)
            }

            console.log(user);
            
            }
        }

        else if(CMD_NAME == 'seeStats'){
            if(user == undefined){
                message.reply("You're not registred yet");
            } 
            else{
                let userString =``;
                for (const key of Object.keys(user)) {
                    userString+= `${key}: ${user[key]}\n`
                }
                message.reply(userString);
            }
        }

        else if(CMD_NAME == 'tryCatch'){
            if(user == undefined){
                message.reply("You do not have any pokeballs");
            }
            else{
                if(user.pokeball > 0){
                    let pokemonName;   
                    pokemon().then(
                    total => { 
                        pokemonName = total;
                        user.pokeball--;
                        user.pokemons.push(pokemonName.name);
                        message.reply(`Yay, you catched a ${pokemonName.name}\n${pokemonName.image}`);   
                        }
                    )
                }
                else{
                    message.reply("You do not have any pokeballs")
                }
                
            }

        }
    }


    //HANDLE NORMAL MESSAGES
    else{
        if(players.length == 0){
            players.push({
                username: message.author.username,
                points: message.content.length,
                pokeball: 0,
                pokemons: Array()
            })
            console.log(players);
        }
        else{
            if(user == undefined){
                players.push({
                    username: message.author.username,
                    points: message.content.length,
                    pokeball: 0,
                    pokemons: Array()
                 
            })}
            else{

                user.points += message.content.length;
            }
            console.log(players);
        }
    }

})







client.login(process.env.DISCORD_TOKEN);
