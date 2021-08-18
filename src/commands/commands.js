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
        
        Player.find({id: playerId})
        .then(  
            player => {
                const playerPoints = player[0].points;
                let playerPokeBalls= player[0].pokeballs;
                playerPokeBalls[newPokeball.getIndex()]+= parseInt(args[0]);

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
                            `:coin: : ${player[0].points}
                            \nPokeballs:
                            \n:baseball: normal: ${player[0].pokeballs[0]}
                            \n:softball: greatball: ${player[0].pokeballs[1]}
                            \n:basketball: master: ${player[0].pokeballs[2]}
                            \n:crystal_ball: ultra: ${player[0].pokeballs[3]}
                            \n:no_entry: Pokemons : ${player[0].pokemons}`
                        )
                    }
                    
                }
            )
    },

    tryCatchCommand : (pokemon,Player,message,playerId,newPokeball) => {
    
        Player.find({id: playerId})
        .then(
            player => {
                const index = newPokeball.getIndex();
                let pokemonArray = player[0].pokemons;
                let pokeballs = player[0].pokeballs;
            
                if(pokeballs[index] > 0){
                    if(Math.floor(Math.random() * (100) + 1) >= newPokeball.getChance()){
                        pokeballs[index]-= 1;
                        message.reply("Oh, the pokemon runned away :(");
                    }
                    else{
                        pokemon()
                        .then(
                            pokeRequest => {
                                pokemonArray.push(pokeRequest.name)
                                message.reply(`Yay, you caught a ${pokeRequest.name}
                                \nType: ${pokeRequest.type} ${pokeRequest.typeIcon}
                                \nStats:\n${pokeRequest.stats} ${pokeRequest.image}`);
                            }
                        )
                    }

                    Player.updateOne({id : playerId}, {
                        pokeballs : pokeballs,
                        pokemons : pokemonArray
                     }, (err)=>{console.log("PlayerUpdated")})

                    
                }
                else{
                    message.reply('You dont have enough pokeballs');
                }
                
            }
        )
    },

    pokeballPrices : (message) => message.reply(`normal: 10 pts\ngreat: 20 pts\nmaster: 25 pts\nultra: 100 pts`),

    
    

}