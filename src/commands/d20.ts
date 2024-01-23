import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
.setName("d20")
.setDescription("Rolle einen d20.")
.addIntegerOption(option => 
    option.setName("bonus")
        .setDescription("Der Bonus auf deinen Wurf."));

export async function execute(interaction: any) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const bonus = interaction.options.getInteger("bonus") ?? 0;

    const baseRollMsg = bonus >= 0 ? `(${roll} + ${bonus}))` : `(${roll} ${bonus})`;
    return interaction.reply(`<@${interaction.user.id}> würfelte ${roll+bonus}! ${baseRollMsg}`);
}
