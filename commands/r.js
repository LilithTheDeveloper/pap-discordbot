const util = require('../utilities/prettyMessages.js');
module.exports = {
    name: 'r',
    description: 'Rolls ANY dice in format [xdy m1 m2..., xdy m1 m2...] where X is the quantity of dice to roll, Y is the dice type (2,4,6,8,10,20,100... etc.) and M are the modifiers for the total roll. \nExamples:\n$1d20 +5 -2\n$d100\n$5d4 -1\nYou can roll more than a dice group separating them by comas (,)',
    execute(msg, args) {
        try {
            var error = [];
            var response = [];
            args = args.join().split(",");

            for (let i = 0; i < args.length; i++) {
                var roll = [];
                let total = 0;
                //Autocomplete dice cmd
                if(args[i].match(/^d/)){ args[i] = "1"+args[i]; }
                args[i]=args[i].replace(/\+/g," +");
                args[i]=args[i].replace(/\-/g," -");
                args[i]=args[i].replace(/\s+/g," ");
                
                //Valitade roll cmd
                if(!args[i].match(/^\d+[dD]\d+([+-]\d)*/)){
                   error.push("**ERROR:** Invalid dice notation -> \""+args[i]+"\"");
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
            util.print(msg,'',response.join("\n"));
        } catch (error) {
            //Whatever error handler :P
            util.print(msg,'',`**ERROR:** \"${error}\"`,'red');
        }
    },
};