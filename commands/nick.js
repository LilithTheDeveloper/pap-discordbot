const fs = require('fs'); //Filesystem

const nameTrackerJSON = './config/nicknameTracker.json'

module.exports = {
    name: 'nick',
    description: 'A command to change your nicknames when in a specific voice channel:\n!nick <register/delete> <\"Nick\"> <\"Channel Name>\"',
    execute(msg, args) {
        var nickJSON = fs.readFileSync(nameTrackerJSON);
        nickJSON = JSON.parse(nickJSON);
        if (!nickJSON.players) {
            nickJSON.players = [];
            saveNick(nickJSON);
        }
        switch (args[1]) {
            case 'register':
                //argumentvalidation
                if (!args[2]) return msg.reply("**ERROR**: Not enough valid arguments\nCorrect format: !nick <register/delete> <\"Nick\"> <\"Channel Name>\"");
                if (!msg.content.match((/\".*?\"/g)[0])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");
                if (!msg.content.match((/\".*?\"/g)[1])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");

                //Argument Saving (thanks RikerTuros)
                try {
                    var nickName = msg.content.match(/\".*?\"/g)[0].replace(/\"?\"/g, '');
                }
                catch (err)
                {
                    console.error("Error parsing message for nickname");
                    console.error(err);
                    return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname in quotation marks (\"like this\")");
                }
                try {
                    var channelName = msg.content.match(/\".*?\"/g)[1].replace(/\"?\"/g, '');
                }
                catch (err) {
                    console.error("Error parsing message for channel");
                    console.error(err);
                    return msg.reply("**ERROR**: Invalid arguments. Remember to put the channel name in quotation marks (\"like this\")");
                }

                //validateChannel & search ID
                if (channelCollection.has(channelName)) {
                    var channelID = channelCollection.get(channelName);
                } else {
                    return msg.reply("**ERROR**: There is no such channel. Maybe you made a typo?");
                }

                //summary
                msg.channel.send(`__**Registration success!**__\nChannel Name: ${channelName}\nNick: ${nickName}`);

                //saving format
                var player;
                //check if player exists
                //true -> load player from file 
                //false -> create new player
                for (let i = 0; i < nickJSON.players.length; i++) {
                    if (nickJSON.players[i].userid === msg.author.id) {
                        player = nickJSON.players[i];
                    }
                }
                if (!player) {
                    var player = {
                        name: msg.member.displayName,
                        userid: msg.author.id,
                        registrations: []
                    }
                    nickJSON.players.push(player);
                }
                //check for existing registration
                //true -> rename nick
                //false -> register
                nickJSON.players.forEach(player => {
                    var found = false;
                    //renaming
                    player.registrations.forEach(register => {
                        if (register.channelid === channelID && player.userid === msg.author.id) {
                            register.nickname = nickName;
                            found = true;
                        }
                    })
                    //new registration
                    if (player.userid === msg.author.id && !found) {
                        player.registrations.push({
                            nickname: nickName,
                            channelid: channelID
                        })
                    }
                });
                saveNick(nickJSON);
                break;
            case 'delete':
                //Validation of the given arguments
                if (!args[2]) return msg.reply("**ERROR**: Not enough valid arguments\nCorrect format: !nick <register/rename/delete> <\"Nick\"> <\"Channel Name>\"");
                if (!msg.content.match((/\".*?\"/g)[0])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");
                var delNickName = msg.content.match(/\".*?\"/g)[0].replace(/\"?\"/g, '');
                for (let i = 0; i < nickJSON.players.length; i++) {
                    for (let j = 0; j < nickJSON.players[i].registrations.length; j++) {
                        if (nickJSON.players[i].registrations[j].nickname === delNickName) {
                            nickJSON.players[i].registrations.splice(j, 1);
                            msg.reply("Successfully removed the nick!");
                            break;
                        }
                    }
                }
                saveNick(nickJSON);
                break;
        }
    },
};

function saveNick(fts) {
    fs.writeFileSync(nameTrackerJSON, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved to [" + nameTrackerJSON + "]!")
}

exports.renameNickname = function(oldState,newState){
    //if user has not switched channels
    if (oldState.channelID === newState.channelID) return;
    var nickJSON = fs.readFileSync(`${trackerPath + nameTrackerJSON}`);
    nickJSON = JSON.parse(nickJSON);
    //Check if userid is in registrations
    if (!nickJSON.players) return;
    nickJSON.players.forEach(player => {
        if (player.userid === newState.member.id) {
            for (let i = 0; i < player.registrations.length; i++) {
                if (player.registrations[i].channelid === newState.channelID && (newState.guild.me.hasPermission('MANAGE_NICKNAMES'))) {
                    newState.member.setNickname(player.registrations[i].nickname)
                    return;
                }
            }
            newState.member.setNickname(player.name)
        }
    });
}