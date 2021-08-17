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
                    let pokeRequest;   
                    pokemon().then(
                    total => { 
                        pokeRequest = total;
                        user.pokeball--;
                        user.pokemons.push(pokeRequest.name);

                        message.reply(`Yay, you catched a ${pokeRequest.name}
                        \nType: ${pokeRequest.type} ${pokeRequest.typeIcon}
                        \nStats:\n ${pokeRequest.stats}
                        \n${pokeRequest.image}`);   
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
