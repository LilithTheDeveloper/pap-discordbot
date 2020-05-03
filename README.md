# pap-assistance-discord-bot
## Description
A discord bot that assists in the daily struggles of dungeons masters and players around the world

Still figuring out how git works, so bear with me.

## Commands:
!nick register "Your Nick" "Channel Name" - Registeres your nickname
!nick delete "Your Nick" - Deletes your nick

This is just a pure implemenation of the nick feature of the Discord bot. If anyone is interested in having a dice rolling feature, I'd also add that to this bot. (Example: https://imgur.com/a/OtFvcJY)

## Installation
- Create a server, for example on aws as described in this [video](https://www.youtube.com/watch?v=W4FTfaHTmB4).
- Install node.js on the server. Install instructions for differente operating systems can be found on the official [node.js website](https://nodejs.org/en/download/).
- Then you need to initialize the directory with these commands:
    ```
    > npm init
    > npm install discord.js
    ```
- Then create a new application (aka bot) on the discord application [developer portal](https://discordapp.com/developers/applications).
- Under the 'bot' menu you should find a 'token' - it's normally hidden and should always stay a secret. You'll need that token later.
- After you created the application on the discord developer website, invite it to your server by following [this guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).
- In the next step you'll need the serverid, you find that id by right clicking the server icon in discord, there should be an option to 'Copy ID'.
- Configure the bot by copying the file config.example.json in the config directory to config.json also in the config directory and insert the secret token for the bot you created and the id of the server where you invited the bot to.
- After that you just need to start the application you just configured. On windows use the startserver.bat, on linux just run
    ```
    > node .
    ```
- Your bot should now appear as online in your server.

<b> This bot is currently intended to be used by people who have a basic understanding of how to setup a discord bot and handle node.js. </b>

## Features
To be added

## Capability Clarification
The bot currently is not able to change the nickname of the server owner*.
This is due to limitations provided by the permission system of Discord, as the server owner will always have the highest permission.
This can be circumvented by transfering ownership of the Discord Server to another secondary account, so the server owner can have his regular account be manipulated by the bot.
<b>Never transfer ownership of the Discord Server to the bot, as you are currently unable to retrieve it.</b>

*Server Owner means the person who originally created the server.
