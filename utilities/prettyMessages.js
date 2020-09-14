const { MessageEmbed } = require('discord.js');

function print(msg,title,body,color="blue"){
    const embed = new MessageEmbed();
    switch(color){
        case "red": color = "ff0000"; break;
        case "green": color = "00ff00"; break;
        case "blue": color = "0000ff"; break;
    }
    if(title.trim() != ""){ embed.setTitle(title); }
    if(color.trim() != ""){ embed.setColor('0x'+color); }
    if(body.trim() != ""){ embed.setDescription(body); }

    msg.channel.send(embed);

}

// add the code below
module.exports = { print }