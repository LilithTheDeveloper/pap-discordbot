
module.exports = {
    name: 'd',
    description: 'Rolls ANY dice in format [xdy m1 m2...] where X is the quantity of dice to roll, Y is the dice type (2,4,6,8,10,20,100... etc.) and M are the modifiers for the total roll. \nExamples:\n$1d20 +5 -2\n$d100\n$5d4 -1',
    execute(msg, args) {
        try {
            var response = [];
            var roll = [];
            let total = 0;

            for (let i = 0; i < args.length; i++) {
                //Autocomplete dice cmd
                if(args[i].match(/^[dD]/)){ args[i] = "1"+args[i]; }
                args[i]=args[i].replace("+"," +");
                args[i]=args[i].replace("-"," -");
                args[i]=args[i].replace(/\s+/," ");
                
                //Valitade roll cmd
                if(!args[i].match(/^\d+[dD]\d+([+-]\d)*/)){
                   response.push("ERROR: Invalid dice notation -> \""+args[i]+"\"");
                   continue;
                }
                //Split modifiers
                let m = args[i].split(" ");

                //Get dices to roll
                let d = m[0].split(/[dD]/);
                let diceNumber = d[0];
                let diceType = d[1];

                for(let j = 0; j < diceNumber; j++ ){
                    let r = Math.floor(Math.random() * Number(diceType))+1;
                    roll.push(r);
                    total += r;
                }

                //Apply modifiers to total roll
                let dice = diceNumber+'d'+diceType;
                for(let j = 1; j < m.length; j++){
                    total += Number(m[j]);
                    dice += m[j];
                }

                //Final response
                response.push(`<@${msg.author.id}> rolled [${dice}]: **${total}** \n Results [ ${roll.join(" , ")} ]`);
                
            }
            //Publish response
            msg.channel.send(response.join("\n"));
        } catch (error) {
            //Whatever error handler :P
            msg.reply(`ERROR: \"${error}\"`);
        }
    },
};