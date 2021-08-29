const { Client, Intents, MessageActionRow, MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";

require('dotenv').config();

const {
    commandPoints,
    buyCommand,
    statsCommand,
    tryCatchCommand,
    pokeballPrices,
    buycard,
    sellPokemon,
    market,
    buypokemon
    } = require('./commands/commands');

const pokemon = require('./pokemon.js');
const mongoose = require('mongoose');

//DB CONFIG
const db =require('./config/key').MongoUri;

//CONNECT TO MONGO
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDb connected'))
.catch((err) => console.log(err));



client.once('ready', () => {
	console.log(`Bot online: ${client.user.username}`);

});



client.on("message", async (message) => {
    if(message.author.bot) return ;
    if(message.content.length == 0 || message.content.length > 200) return;

    const playerId = message.author.id;
    const Player = require('./models/Player');
    const Pokemon = require('./models/Pokemon');
    const Pokeball = require('./classes/Pokeball');
    const Embed = new MessageEmbed();

    if(message.channel.name == 'pokemon-area'){
    
    // HANDLE COMMANDS
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        switch (CMD_NAME) {
            case 'points':
                commandPoints(Player, message,playerId);
                break;
            case 'buypokeball':
                buyCommand(Player,Pokeball,message,playerId,args);
                break;
            case 'stats':
                statsCommand(Player,message,playerId,Embed);
                break;  
            case 'catch':
                const newPokeball = new Pokeball(args[0])    
                tryCatchCommand(pokemon,Player,message,playerId,newPokeball,Embed);          
                break;
            case 'prices':
                pokeballPrices(message);
                break;
            case 'buycard':
                buycard(args[0],message,Player,Embed);
                break; 
            case 'sellpokemon':
                sellPokemon(Player,message,args[0],args[1],Pokemon);
                break;
            case 'market':
                market(Pokemon,message);
                break;
            case 'buypokemon':
                buypokemon(message,Player,Pokemon,args[0]);
                break;    
            default:
                break;
        }
        

        }
    }
    
    
    //HANDLE NORMAL MESSAGES
    else{
        Player.find({playerId : playerId})
        .then(
            player => {
                //CREATING PLAYER IN DOCUMENT
                if(player <= 0){
                    const newPlayer = new Player({
                        playerId: playerId,
                        icon: message.author.avatar,
                        tag: message.author.tag,
                        points : message.content.length,
                    });

                    newPlayer.save()
                    .then( player => console.log(`Player: ${player}`))
                    .catch(err => console.log(err));
                }
                
                //UPDATING PLAYER DATA
                else{
                    Player.updateOne({playerId : playerId}, {
                        points : player[0].points + message.content.length
                        }, (err)=>{
                            if(err){
                                console.log(err);
                            }
                        }
                    )
                                               
                    
                }
            }
        )
        
        
    }
    

})


client.login(process.env.DISCORD_TOKEN);
