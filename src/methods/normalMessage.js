module.exports = {
    
    /**
     * Create a new User if player isn't in the database
     * @param {Model} Player 
     * @param {Model} Comment 
     */
    createNewUser : (Player,Comment,playerId,message) =>{
        const newPlayer = new Player({
            playerId: playerId,
            icon: message.author.avatar,
            tag: message.author.tag,
            points : message.content.length,
        });

        const newComment = new Comment({
            playerId: playerId,
            lastComment: new Date()
        })
        newPlayer.save()
        .then( player => {
            console.log(`Player: ${player}`)

            newComment.save()
            .then(comment => console.log(`Comment: ${comment}`))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    
    /**
     * Update User
     * @param {Model} Player 
     * @param {Model} Comment 
     * @param {String} playerId 
     */
    updateUser : (Player,Comment,playerId,player,message) =>{
        Comment.findOne({playerId: playerId})
        .then(
            comment => {
                const now = new Date();
                if(now - comment.lastComment < 30000) return;

                let newPoints;
                message.attachments.size > 0 ?  newPoints = player[0].points + message.content.length + 20 : newPoints = player[0].points + message.content.length; 
                
                
                if(message.author.avatar != player.icon){
                    Player.updateOne({playerId : playerId}, {
                        points : newPoints,
                        icon: message.author.avatar
                        }, (err)=>{ if(err)console.log(err)}
                    );
                        
                    Comment.updateOne({playerId: playerId},{
                        lastComment : now
                    }, (err)=>{ if(err)console.log(err)});
                }
                else{
                    Player.updateOne({playerId : playerId}, {
                        points : newPoints
                        }, (err)=>{ if(err)console.log(err)}
                    );
                        
                    Comment.updateOne({playerId: playerId},{
                        lastComment : now
                    }, (err)=>{ if(err)console.log(err)});
                }

            }
        )
    }
}