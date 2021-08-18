module.exports =  {
    commandPoints : (Player, message, playerId) => {
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
    },
    buyCommand : (Player,Pokeball,message,playerId,args) => {
        const newPokeball = new Pokeball(args[1]);
        let index;
        switch (newPokeball.getName()) {
            case 'normal':
                index = 0;
                break;
            case 'great':
                index = 1;
                break;
            case 'master':
                index = 2;
                break;
            case 'ultra':
                index = 3;
                break;
            default:
                break;
        }

        Player.find({id: playerId})
        .then(  
            player => {
                const playerPoints = player[0].points;
                let playerPokeBalls= player[0].pokeballs;
                playerPokeBalls[index]+= parseInt(args[0]);

                if(playerPoints < args[0] * newPokeball.getPrice()){
                    message.reply("You don't have enough points");
                }  
                else{
                    Player.updateOne({id : playerId}, {
                        
                        points : playerPoints - (args[0] * newPokeball.getPrice()),
                        pokeballs: playerPokeBalls 
                        
                        }, (err)=>{
                            message.reply(`You bougth ${args[0]} pokeballs ${args[1]} :baseball:`)
                            if(err){
                                console.log(err);
                            }
                        }
                    )
                    .then(player => console.log(`Player ${playerId} updated`));     
                }
            }
        )
    },
    statsCommand : (Player,message,playerId) => {
        Player.find({id : playerId})
            .then(
                player => {
                    if(player.length == 0){
                        message.reply("You're not registred yet :(")
                    }
                    else{
                        message.reply(
                            `Points: ${player[0].points}
                            \nPokeballs:
                            \n -normal: ${player[0].pokeballs[0]}
                            \n -greatball: ${player[0].pokeballs[1]}
                            \n -master: ${player[0].pokeballs[2]}
                            \n -ultra: ${player[0].pokeballs[3]}
                            \nPokemons : ${player[0].pokemons}`
                        )
                    }
                    
                }
            )
    },

    tryCatchCommand : (total,Player,message,playerId) => {
        let pokeRequest = total;
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
                            message.reply(`Yay, you caught a ${pokeRequest.name}
                            \nType: ${pokeRequest.type} ${pokeRequest.typeIcon}
                            \nStats:\n${pokeRequest.stats} ${pokeRequest.image}`);
                            
                            
                        }
                    )
                }
                else{
                    message.reply('You dont have enough pokeballs');
                }
                
            }
        )
    },

    pokeballPrices : (message) => message.reply(`normal: 10\ngreat: 20\nmaster: 25\nultra: 100`)
    

}