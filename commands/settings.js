const util = require('../utilities/prettyMessages.js');
const fs = require('fs'); //Filesystem
const filePath = './config/';
const fileName = 'config.json';
const configFile = filePath + fileName;
const description = 'Change bot settings:\n !settings prefix [character]\n !settings experimental_commands [on/off]';

module.exports = {
    name: 'settings',
    description: description,
    execute(msg, args) {
		var config = fs.readFileSync(configFile);
		config = JSON.parse(config);
        switch(args[1]){
            case 'prefix':
                if (args[2] == undefined){ args[2] = ''; }
                switch(args[2].length){
                    case 1:
                        config.prefix = args[2];
                        saveConfig(config);
                        util.print(msg,'OK',"Prefix changed to "+args[2],'green');
                    break;
                    case 0:
                        util.print(msg,'MISSING PARAMETERS',"!settings prefix [character]",'red');
                    break;
                    default:
                        util.print(msg,'ERROR',"Prefix must be a single character",'red');
                    break;
                }
            break;
            case 'current_settings':
                var response = "";
                let keys = Object.keys(config);
                for(let i = 0; i < keys.length; i++){
                    var val = config[keys[i]];
                    switch(typeof val){
                        case 'boolean': val = val?'ON':'OFF'; break;
                    }
                    response += "\n**"+keys[i]+"**: "+val;
                }
                msg.channel.send(response);
            break;
            case 'experimental_commands':
                args[3] = args[3].tolowercase();
                if(['on','off'].indexOf(args[3]) >= 0){
                    config.experimental_commands = args[3] == 'on' ? true : false;
                    saveConfig(config);
                }else{
                    msg.channel.send("**ERROR** -- Experimental_commands must be [on] or [off] ");
                }
            break;
            default:
                msg.channel.send(description);
            break;
        }
    },
};

function saveConfig(fts) {
    fs.writeFileSync(configFile, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved to [" + fileName + "]!")
}