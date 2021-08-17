const { Client, Intents, MessageActionRow } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";

require('dotenv').config();


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
});



client.on("message", async (message) => {
    if(message.author.bot) return ;
    if(message.content.length == 0 || message.content.length > 200) return;

    const playerId = message.author.id;
    const Player = require('./models/Player');


    // HANDLE COMMANDS
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        
        if(CMD_NAME == 'points'){
            Player.find({id : playerId})
            .then(player => {
                if(player.length > 0){
                    message.reply(`You have ${player[0].points} points`);
                }
                else{
                    message.reply("You don't have any points");
                }

            })
            .catch(err => console.log(err))
        }
        else if(CMD_NAME == 'buyPokeBall' && args > 0){
            Player.find({id: playerId})
            .then(
                player => {
                    const playerPoints = player[0].points;
                    let playerPokeBalls= player[0].pokeballs;

                    if(playerPoints < args * 10){
                        message.reply("You don't have enough points");
                    }  
                    else{
                        Player.updateOne({id : playerId}, {
                            points : playerPoints - (args * 10),
                            pokeballs: playerPokeBalls += parseInt(args) 
                            }, (err)=>{
                                message.reply(`You bougth ${args} pokeballs :baseball:`)
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

        else if(CMD_NAME == 'seeStats'){
            
            Player.find({id : playerId})
            .then(
                player => {
                    message.reply(
                        `Points: ${player[0].points}
                        \nPokeballs: ${player[0].pokeballs}
                        \nPokemons : ${player[0].pokemons}`
                    )
                }
            )
        }

        else if(CMD_NAME == 'tryCatch'){
            let pokeRequest;
            pokemon()
            .then(
                total => {
                    pokeRequest = total;
                    Player.find({id: playerId})
                    .then(
                        player => {
                            let pokemonArray = player[0].pokemons;
                            let pokeballs = player[0].pokeballs;
                            if(pokeballs > 0){
                                pokemonArray.push(pokeRequest.name)
                                Player.updateOne({id : playerId}, {
                                    pokeballs : pokeballs - 1 ,
                                    pokemons : pokemonArray
                                    }, (err)=>{
                                        message.reply(`Yay, you catched a ${pokeRequest.name}
                                        \nType: ${pokeRequest.type} ${pokeRequest.typeIcon}
                                        \nStats:\n${pokeRequest.stats}\n${pokeRequest.image}`);
                                        if(err){
                                            console.log(err);
                                        }
                                    }
                                )
                            }
                            else{
                                message.reply('You dont have enough pokeballs');
                            }
                            
                        }
                    )
                }
            )

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
                        pokeballs : 0,
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
