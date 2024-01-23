# PEN & PAPER Discord Bot Reborn 
## Description
New year, time for a new recode of the project

## Installation
- Create a server, for example on aws as described in this [video](https://www.youtube.com/watch?v=W4FTfaHTmB4).
- Install node.js on the server. Install instructions for differente operating systems can be found on the official [node.js website](https://nodejs.org/en/download/).
- Clone this repository on the server.
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
- Statblock creation for various systems
    
## Commands

## Capability Clarification
