import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { commands } from "./commands/commands";
import { deployCommands } from "./deploy-commands";

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });

client.once(Events.ClientReady, readyClient => {
    console.log("🤖 Logged in as", readyClient.user?.tag);
    deployCommands({ guildId: config.GUILD_ID });
});

client.on(Events.GuildCreate, async (guild) => {
    console.log("🤖 Joined guild", guild.name);
    await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);
