const Discord = require('discord.js')
const config = require('../../config.json')
module.exports = {
    commands: ['help', 'h'],
    callback: (message) => {
        // Ensure the initial command message gets deleted
    
        message.delete()
        const helpEmbed = new Discord.MessageEmbed()
        .setTitle('Quickstart Guide / FAQ')
        .setDescription('(Admin Only)')
        .setColor(config.colors.secondary)
        .addFields([
            {
                name: '%setmaps <channel-id>',
                value: 'Set your channel where you want to receive Map updates.'
            },
            {
                name: '%start',
                value: 'This will start the bot look for map updates and post new maps to the channel you have setup.\n`Default:` It will use the channel you send this command in.'
            },
            {
                name: '%removechannel',
                value: 'This will remove the connection to the channel.'
            },
            {
                name: 'It seems like I dont receive any map updates?',
                value: 'If that is the case simply re-type `%start` again.'
            },
            {
                name: 'How often does the bot check for new maps?',
                value: 'The bot is currently set to `1 check / 15min`'
            }
        ])
        .setFooter('Issues/Problems? Contact khenzy#9999')

        message.channel.send({ embed: helpEmbed })
    }
}