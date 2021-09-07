module.exports = {
    
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