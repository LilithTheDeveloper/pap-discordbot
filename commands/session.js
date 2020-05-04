const Discord = require('discord.js');

var currentSessions = [];

module.exports = {
    name: 'session',
    description: 'Command that shows commands, funny huh?',
    experimental: true,
    execute(msg, args) {
        switch (args[1]) {
            case "start":
                if(currentSessions.length > 0) return msg.reply("ERROR: Another session is currently running.");
                var channelID = msg.member.voice.channelID;
                var channelVoiceStates = msg.member.guild.voiceStates.cache;
                var session = {
                    channelID: channelID,
                    players: [],
                }
                channelVoiceStates.forEach(i => {
                    if(i.channelID === channelID){
                        let player = {
                            userid: i.id,
                            criticalgood: 0,
                            criticalbad: 0
                        }
                        session.players.push(player);
                    }
                });
                currentSessions.push(session);
                console.log(session);
                break;
            case "stop":
                break;
            case "results":
                if(currentSessions.length < 0) return msg.reply("ERROR: No session is running at the time.");
                var results = `__**Session over**__\n`;
                currentSessions.forEach(element => {
                    element.players.forEach(player => {
                        results += `<@${player.userid}>\nNatural 20's: ${player.criticalgood}\nNatural 1's: ${player.criticalbad}\n`;
                    });
                });
                msg.channel.send(results);
                currentSessions.pop();
                break;
        }
    },
    activeSessions(){
        return currentSessions;
    },
};