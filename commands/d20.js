module.exports = {
	name: 'd20',
    description: 'Roll the dice! Rolls a classical d20\n!d20 <Bonus>',
    debug(message, args){
        for(var i = 0; i < 30; i++){
            console.log(RandomFromTo(0,20));
        }
    },
	execute(msg, args) {
        try {
            var roll = RandomFromTo(0, 20);
            var bonus = 0;
            var sign = "+";
            var cmd = "";
            if (!args[1]) {
                bonus = 0;
            } else {
                for (let i = 1; i < args.length; i++) {
                    cmd += args[i];
                }
                //potentially dangerous code, I'm not sure how to properly secure an eval command.
                //eval in this case is used to make bonus calculation possible, but it should be used with much caution
                bonus = eval(cmd.replace(/[^\d+-/*//]|\/\d+/g, ''));
                if (Number(bonus) < 0) sign = "";
                bonus = bonus || 0;
            }
            var res = ` rolled: **${roll}** with **${sign}${bonus}**. That's a **${Number(roll) + Number(bonus)}**`;
            switch (roll) {
                case 20:
                    res += ` with a critical success `;
                    break;
                case 1:
                    res += ` with a critical failure`;
                    break;
            }
            msg.channel.send(`<@${msg.author.id}>${res}!`);
        } catch (error) {
            msg.reply(`Something went wrong... ${error}\n`)
        }
    },
};

RandomFromTo = function (from, to) {
	return Number(Math.floor(Math.random() * (to + -from) + from + 1));
}