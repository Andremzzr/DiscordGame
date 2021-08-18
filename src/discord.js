const { Client, Intents, MessageActionRow , MessageAttachment} = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";

require('dotenv').config();

const {
    commandPoints,
    buyCommand,
    statsCommand,
    tryCatchCommand,
    pokeballPrices 
    } = require('./commands/commands');

const pokemon = require('./pokemon.js');
const mongoose = require('mongoose');

//DB CONFIG
const db =require('./config/key').MongoUri;

//CONNECT TO MONGO
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDb connected'))
.catch((err) => console.log(err));



client.once('ready', () => {
	console.log(`Bot online: ${client.user.username}`);
    console.log('---------------------------------')
});



client.on("message", async (message) => {
    if(message.author.bot) return ;
    if(message.content.length == 0 || message.content.length > 200) return;

    const playerId = message.author.id;
    const Player = require('./models/Player');
    const Pokeball = require('./Pokeball');

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
            case 'seeStats':
                statsCommand(Player,message,playerId);
                break;
            case 'tryCatch':
                pokemon()
                .then(
                    total => {
                        tryCatchCommand(total,Player,message,playerId)
                    }
                )
                break;
            case 'prices':
                pokeballPrices(message);
                break;
            default:
                break;
        }
        

    }


    //HANDLE NORMAL MESSAGES
    else{
        Player.find({id : playerId})
        .then(
            player => {
                //CREATING PLAYER IN DOCUMENT
                if(player <= 0){
                    const newPlayer = new Player({
                        id: playerId,
                        points : message.content.length,
                    });

                    newPlayer.save()
                    .then( player => console.log(`Player: ${player}`))
                    .catch(err => console.lgo(err));
                }
                
                //UPDATING PLAYER DATA
                else{
                    Player.updateOne({id : playerId}, {
                        points : player[0].points + message.content.length
                        }, (err)=>{
                            if(err){
                                console.log(err);
                            }
                        }
                    )
                    .then(player => console.log(`Player ${playerId} updated`));                           
                    
                }
            }
        )
        
        
    }
    

})


client.login(process.env.DISCORD_TOKEN);
