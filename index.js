//#region Imports, Versioning and stuff
//SOMESTUFF
const VERSION = "1.0";
const AUTHOR = "Lilith the Succubus";
//REQUIRED ''IMPORTS''
const Discord = require('discord.js'); //duh
const fs = require('fs'); //filesystem

//Main Instance of the bot, call this for everything
const bot = new Discord.Client();

//External JSON filestest
const config = require('./config/config.json');
const help = require('./config/help.json');
//#endregion

bot.on('ready', () => {
    console.log('This bot is now active\nVersion: ' + VERSION);
    channelCollection = gatherChannels();
})

bot.on('message', msg => {
    if (msg.content[0] === config.prefix) {
        let args = msg.content.substring(config.prefix.length).toLowerCase().split(" ");
        switch (args[0]) {
            //#region nicks
            case 'nick':
                var nickJSON = fs.readFileSync('nicknameTracker.json');
                nickJSON = JSON.parse(nickJSON);
                if (!nickJSON.players) {
                    nickJSON.players = [];
                    saveNick(nickJSON);
                }
                switch (args[1]) {
                    case 'register':
                        //argumentvalidation
                        if (!args[2]) return msg.reply("**ERROR**: Not enough valid arguments\nCorrect format: !nick <register/rename/delete> <\"Nick\"> <\"Channel Name>\"");
                        if (!msg.content.match((/\".*?\"/g)[0])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");
                        if (!msg.content.match((/\".*?\"/g)[1])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");

                        //argument saving
                        var nickName = msg.content.match(/\".*?\"/g)[0].replace(/\"?\"/g, '');
                        var channelName = msg.content.match(/\".*?\"/g)[1].replace(/\"?\"/g, '');

                        //validateChannel & search ID
                        if (channelCollection.has(channelName)) {
                            var channelID = channelCollection.get(channelName);
                        } else {
                            return msg.reply("**ERROR**: There is no such channel. Maybe you made a typo?");
                        }

                        //summary
                        msg.channel.send(`__**Sucessful Registration**__\nChannel Name: ${channelName}\nNick: ${nickName}`);

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
                        //argumentvalidation
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
                break;
            //#endregion
        }
    }
})

bot.on('voiceStateUpdate', (oldState, newState) => {
    //if user has not switched channels
    if (oldState.channelID === newState.channelID) return;
    var nickJSON = fs.readFileSync('nicknameTracker.json');
    nickJSON = JSON.parse(nickJSON);
    //Check if userid is in registrations
    if(!nickJSON.players) return; 
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
})

function gatherChannels() {
    var server = bot.guilds.cache.find(guild => guild.id === config.server_id);
    var channels = [];
    var collection = new Discord.Collection();
    server.channels.cache.toJSON().forEach(x => {
        if (x.type === 'voice') channels.push(x);
    });
    channels.forEach(x => {
        collection.set(x.name, x.id);
    });
    return collection;
}

function saveNick(fts) {
    //filename is the path where the file is located
    var fileName = "nicknameTracker.json"
    var name = "nicknameTracker"
    fs.writeFileSync(fileName, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved " + name + " to [" + name + ".json]!")
}

bot.login(config.token);