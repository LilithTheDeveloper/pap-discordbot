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


//External JSON filestest
const config = require('./config/config.json');
const help = require('./config/help.json');
//#endregion

//#region Infrastructure

//REQUIRED fileSize
const nameTrackerJSON = 'nicknameTracker.json'
const trackerPath = './'+nameTrackerJSON
const initTracker = {"": []}

//#endregion

bot.on('ready', () => {
    console.log('This bot is now active\nVersion: ' + VERSION);
    channelCollection = gatherChannels();
    fileCheck();
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
        if(msg.content.includes("info")){
            msg.reply(bot.commands.get(command).description);
        }
        else{
            bot.commands.get(command).execute(msg, args);
        }
    } catch (error) {
        console.error(error);
        msg.reply('Something has gone wrong, please scream!');
    }
})

bot.on('voiceStateUpdate', (oldState, newState) => {
    //if user has not switched channels
    if (oldState.channelID === newState.channelID) return;
	
	/* check if the user is entering a voice chat from text. This is done to determine if we need to update their default nickname.
	* If they are entering a voice channel from nothing, updateNick will be true.
	* If they are swapping between voice channels, updaeNick will be false.
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
    var nickJSON = fs.readFileSync(nameTrackerJSON);
    nickJSON = JSON.parse(nickJSON);
	
    //Check if userid is in registrations
    if (!nickJSON.players) return;
    nickJSON.players.forEach(player => {
        if (player.userid === newState.member.id) {
			//check the stored default nickname against the current nickname
			//only update the nickname if we are going from no voice channel to a voice channel
			if (player.name != oldState.member.nickname && updateNick) {
				player.name = oldState.member.nickname;
				//I couldn't figure out how to call the existing saveNick function from nick.js so I just put the important lines here
				fs.writeFileSync(nameTrackerJSON, JSON.stringify(nickJSON), null, 4);
				console.log("Succesfully updated default name to: \"" + player.name + "\" for userid: " + oldState.member.id);
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
function fileCheck(){
    if (fs.existsSync(trackerPath)) {
		console.warn("nicknameTracker.json file exists, moving on");
	}
	else
	{
		console.warn("nicknameTracker.json file missing, creating a new one");
		var emptyJson = JSON.stringify(initTracker);
		fs.writeFile('nicknameTracker.json', emptyJson, function(err, result) {
			if(err) console.log('error', err);
		});
	}
}

bot.login(config.token);