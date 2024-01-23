import { CommandInteraction, SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder()
.setName("statblock")
.setDescription("Generiere einen Statblock für einen Spielercharakter.");

export async function execute(interaction: CommandInteraction) {
    const statblock: Statblock = createStatblock();

    const statblockMessage = `<@${interaction.user.id}> hat einen Statblock gewürfelt:\n`
    + `\`\`\`\n`
    + `【 ${statblock.statline_1.stat_1} ${statblock.statline_1.stat_2} ${statblock.statline_1.stat_3} | ${statblock.statline_1.stat_lowest} 】 → ${statblock.statline_1.total}\n`
    + `【 ${statblock.statline_2.stat_1} ${statblock.statline_2.stat_2} ${statblock.statline_2.stat_3} | ${statblock.statline_2.stat_lowest} 】 → ${statblock.statline_2.total}\n`
    + `【 ${statblock.statline_3.stat_1} ${statblock.statline_3.stat_2} ${statblock.statline_3.stat_3} | ${statblock.statline_3.stat_lowest} 】 → ${statblock.statline_3.total}\n`
    + `【 ${statblock.statline_4.stat_1} ${statblock.statline_4.stat_2} ${statblock.statline_4.stat_3} | ${statblock.statline_4.stat_lowest} 】 → ${statblock.statline_4.total}\n`
    + `【 ${statblock.statline_5.stat_1} ${statblock.statline_5.stat_2} ${statblock.statline_5.stat_3} | ${statblock.statline_5.stat_lowest} 】 → ${statblock.statline_5.total}\n`
    + `【 ${statblock.statline_6.stat_1} ${statblock.statline_6.stat_2} ${statblock.statline_6.stat_3} | ${statblock.statline_6.stat_lowest} 】 → ${statblock.statline_6.total}\n`
    + `(Statblock Wertung: ${statblock.pointbuy})\n`
    + `\`\`\`\n`

    return interaction.reply(statblockMessage);
}


function calculatePointbuy(statline: Statline): number {
    const pointbuyMap: Map<number, number> = new Map([
        [8, 0],
        [9, 1],
        [10, 2],
        [11, 3],
        [12, 4],
        [13, 5],
        [14, 7],
        [15, 9],
        [16, 11],
        [17, 13],
        [18, 15],
    ]);

    return pointbuyMap.get(statline.total) ?? 0;
}

function calculatePointbuyTotal(statlines: Statline[]): number {
    let total: number = 0;
    statlines.forEach(statline => {
        total += calculatePointbuy(statline);
    });

    return total;
}

function createStatline(rolls: number[]): Statline {
    rolls = rolls.sort((a, b) => b - a);

    const statline: Statline = {
        stat_1: rolls[0],
        stat_2: rolls[1],
        stat_3: rolls[2],
        stat_lowest: rolls[3],
        total: rolls[0] + rolls[1] + rolls[2], 
    }

    return statline;
}

function createStatblock(): Statblock{
    const rolls: number[][] = Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1));

    const statblock: Statblock = {
        statline_1: createStatline(rolls[0]),
        statline_2: createStatline(rolls[1]),
        statline_3: createStatline(rolls[2]),
        statline_4: createStatline(rolls[3]),
        statline_5: createStatline(rolls[4]),
        statline_6: createStatline(rolls[5]),
        pointbuy: calculatePointbuyTotal([createStatline(rolls[0]), createStatline(rolls[1]), createStatline(rolls[2]), createStatline(rolls[3]), createStatline(rolls[4]), createStatline(rolls[5])]),
    }

    return statblock;
}

type Statblock = {
    statline_1: Statline,
    statline_2: Statline,
    statline_3: Statline,
    statline_4: Statline,
    statline_5: Statline,
    statline_6: Statline,
    pointbuy: number,
}

type Statline = {
    stat_1: number,
    stat_2: number,
    stat_3: number,
    stat_lowest: number,
    total: number,
}
