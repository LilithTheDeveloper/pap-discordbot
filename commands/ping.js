module.exports = {
	name: 'ping',
    description: 'Command totally not copy & pasted from the discordjs.guide page about command handling!',
	execute(message, args) {
		message.channel.send('Pong.');
    },
};