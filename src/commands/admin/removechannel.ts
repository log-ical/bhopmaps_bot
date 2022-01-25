import { MessageEmbed } from "discord.js"
const db = require('../../database/db')
const config = require('../../config.json')
module.exports = {
    commands: 'removechannel',
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You do not have permission to do this.',
    callback: (message) => {
        const { guild } = message
        message.delete()
        

        // Database

        db.query(`SELECT * from bm_newmaps WHERE guildId = '${guild.id}'`, (err, rows) => {
            if (err) throw err;

            let sql = `UPDATE bm_newmaps

            SET
            mapPostChannelId = '0'

            WHERE guildId = '${guild.id}'
            `

            db.query(sql)
        
            const removeChannel = new MessageEmbed() 
            .setTitle('Success ✅')
            .setDescription('Removed channel connection')
            .setColor(config.colors.secondary)
            .addField('Removed by', message.author, true)
            message.channel.send({ embed: removeChannel}).then(msg => {msg.delete({timeout: 5000})})
            
        })
    }
}