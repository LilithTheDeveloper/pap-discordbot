//#region Imports, Versioning and stuff
//SOMESTUFF
const VERSION = "1.0";
const AUTHOR = "Lilith the Succubus";
//REQUIRED ''IMPORTS''
const Discord = require('discord.js'); //duh
const fs = require('fs'); //filesystem


//Main Instance of the bot, call this for everything
const bot = new Discord.Client();

//Code for dynamic command handling
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
}
//Filesystem Handling - I think every json file should end up in the config directory. Just to not clutter the main directory too much.
const nameTrackerJSON = 'nicknameTracker.json'
const configJSON = 'config.json'
var files = [nameTrackerJSON, configJSON]

const trackerPath = './config/'
const initTracker = { "": [] }

fileCheck();
const config = require('./config/config.json');

//External JSON filestest
//#endregion

//#region Infrastructure





bot.on('ready', () => {
    console.log('This bot is now active\nVersion: ' + VERSION);
    channelCollection = gatherChannels();
    //initializing the consts


})

bot.on('message', msg => {

    //Exit when incoming message does not start with specifed prefix or is sent by the bot
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    //Remove Prefix and create Array with each of the arguments
    let args = msg.content.substring(config.prefix.length).toLowerCase().split(/ +/);

    //First argument passed is set to command
    let command = args[0];

    //Exit if the command doesn't exit
    if (!bot.commands.has(command)) return;

    try {
        if (msg.content.includes("info")) {
            msg.reply(bot.commands.get(command).description);
        }
        else if (msg.content.includes("debug")) {
            bot.commands.get(command).debug(msg, args);
        }
        else {
            bot.commands.get(command).execute(msg, args);
        }
    } catch (error) {
        console.error(error);
        msg.reply('ERROR: Invalid Syntax');
    }
})

bot.on('voiceStateUpdate', (oldState, newState) => {
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

//FILE INIT
function fileCheck() {
    var dir = "config"

    var config_prefab = {
        prefix: "!",
        token: "<Enter Bot Token>",
        server_id: "<Enter Server ID>"
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var emptyJson = "";
    for (var file of files) {
        if (fs.existsSync(trackerPath + file)) {
            console.warn(`${file} exists. Moving on.`);
        }
        else {
            console.warn(`${file} file missing -> Creating a new one`);
            switch (file) {
                case "config.json":
                    emptyJson = JSON.stringify(config_prefab);
                    break;
                default:
                    emptyJson = JSON.stringify(initTracker);
                    break;
            }
            var path = trackerPath + file;
            //Needs to be syncronized to correcty write to files
            fs.writeFileSync(path, emptyJson, function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}

bot.login(config.token)
    .then(console.log("Bot Login"))
    .catch(error => console.log("The provided token is invalid. Please check your config file in config/config.json for a valid bot token.\n" + error))