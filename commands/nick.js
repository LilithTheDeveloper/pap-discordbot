const fs = require('fs'); //Filesystem
const trackerPath = './config/';
const nameTrackerJSON = 'nicknameTracker.json';
const nameTracker = trackerPath + nameTrackerJSON;

module.exports = {
    name: 'nick',
    description: 'A command to change your nicknames when in a specific voice channel:\n!nick <register/delete> <\"Nick\"> <\"Channel Name>\"',
    execute(msg, args) {
        var nickJSON = fs.readFileSync(nameTracker);
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
    renameNickname(oldState,newState){
        //if user has not switched channels
        if (oldState.channelID === newState.channelID) return;
		
		/* check if the user is entering a voice chat from text. This is done to determine if we need to update their default nickname.
		* If they are entering a voice channel from nothing, updateNick will be true.
		* If they are swapping between voice channels, updateNick will be false.
		* If they are leaving a voice channel to return to just text, updateNick will be false.
		*/
		let oldvoice = false;
		let newvoice = false;
		try {
			oldvoice = oldState.channel.type == 'voice';
		} catch (err) { /*Swallow the exception, the user is not in a "valid" channel, assuming not voice*/ }
		try { 
			newvoice = newState.channel.type == 'voice';
		} catch (err) { /*Swallow the exception, the user is not in a "valid" channel, assuming not voice*/ }
		let updateNick = !oldvoice && newvoice;
		
		//Load the nickname JSON file
        var nickJSON = fs.readFileSync(nameTracker);
        nickJSON = JSON.parse(nickJSON);
		
        //Check if userid is in registrations
        if (!nickJSON.players) return;
        nickJSON.players.forEach(player => {
            if (player.userid === newState.member.id) {
				//check the stored default nickname against the current nickname
				//only update the nickname if we are going from no voice channel to a voice channel
				if (player.name != oldState.member.nickname && updateNick)
					player.name = oldState.member.nickname;
					saveNick(nickJSON);
				}
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
};

function saveNick(fts) {
    fs.writeFileSync(nameTracker, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved to [" + nameTrackerJSON + "]!")
}
