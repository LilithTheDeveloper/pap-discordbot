diceCalucationUtilities = require(`../utilities/diceCalucationUtilities.js`)

module.exports = {
    name: 'd',
    description: 'Rolls ANY dice!',
    execute(msg, args) {
        if (!args[1]) return msg.reply('**ERROR:** Invalid dice notation.');
        try {
            var cmd = "";
            for (let i = 1; i < args.length; i++) {
                cmd += args[i];
            }
            let roll = diceCalucationUtilities.diceCalc(cmd.trim());
            let a = `<@${msg.author.id}> rolled [${cmd}]: **${roll}**`;
            msg.channel.send(a);
        } catch (error) {
            msg.reply(`ERROR: Invalid dice notation -> \`${error}\`\n` +
                `You entered: ${args[1]}\n` +
                `The bot received: ${cmd}`);
        }
    },
};