import { MessageEmbed } from 'discord.js';
const db = require('../../database/db')
const config = require('../../config.json')
module.exports = {
    commands: 'setmaps',
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You do not have permission to do this.',
    callback: (message, args) => {
        const { guild } = message
        message.delete()
        

        // Database

        db.query(`SELECT * from bm_newmaps WHERE guildId = '${guild.id}'`, (err, rows) => {
            if (err) throw err;
            
            let sql = `UPDATE sm_newmaps

            SET
            mapPostChannelId = '${args[0]}'

            WHERE guildId = '${guild.id}'
            `

            db.query(sql);


            const setNew = new MessageEmbed() 
            .setTitle('Success.')
            .setDescription(`✅ You have successfully set Channel <#${args[0]}> to receive map updates.`)
            .setColor(config.colors.secondary)
            .addField('GuildId', guild.id, true)
            .addField('Set by', message.author, true)
            message.channel.send({ embed: setNew}).then(msg => {msg.delete({timeout: 5000})})
            
        })
    }
}