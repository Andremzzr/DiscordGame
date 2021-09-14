module.exports = async (image, description,player) => {
    const newActivitie = {
        image: image,
        message: description
    };

    if(player.activities.length == 5){
        player.activities.shift();
    }

    player.activities.push(newActivitie);

    console.log('New Activitie by '+ player.playerId);
    console.log(newActivitie);
}