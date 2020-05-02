# pap-assistance-discord-bot
## Description
A discord bot that assists in the daily struggles of dungeons masters and players around the world

Still figuring out how git works, so bear with me.

Command:
!nick register "Your Nick" "Channel Name" - Registeres your nickname
!nick delete "Your Nick" - Deletes your nick

This is just a pure implemenation of the nick feature of the Discord bot. If anyone is interested in having a dice rolling feature, I'd also add that to this bot. (Example: https://imgur.com/a/OtFvcJY)

To make this bot work, one needs to install node.js, initialize the directory by opening a command prompt.
Enter "npm init" and "npm install discord.js". I believe that should be all, but tell me if it's not.

To make the bot work, rename the config_example.json to config.json and edit the file to contain everything nessecary. (Meaning server id, aswell as bot token)

This bot is currently intended to be used by people who have a basic understanding of how to setup a discord bot and handle node.js.

## Features
To be added

## Capability Clarification
The bot currently is not able to change the nickname of the server owner*.
This is due to limitations provided by the permission system of Discord, as the server owner will always have the highest permission.
This can be circumvented by transfering ownership of the Discord Server to another secondary account, so the server owner can have his regular account be manipulated by the bot.
<b>Never transfer ownership of the Discord Server to the bot, as you are currently unable to retrieve it.</b>

*Server Owner means the person who originally created the server.
