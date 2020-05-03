var currentSessions = [];

module.exports = {
    name: 'session',
    description: 'Command that shows commands, funny huh?',
    execute(msg, args) {
        switch (args[1]) {
            case "start":
                var matches = msg.content.match(/\".*?\"/g)[0].replace(/\"?\"/g, '');
                var session = {
                    channelID: matches,
                    players: [],
                }
                msg
                for(var users of channel){

                }
                break;
            case "stop":
                break;
            case "results":
                break;
        }
    },
};