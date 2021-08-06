const Discord = require('discord.js')
const db = require('../../database/db')
const axios = require('axios')
const config = require('../../config.json')
module.exports = {
    commands: 'start',
    permissions: 'ADMINISTRATOR',
    callback: async (message) => {
        message.delete()
        message.channel.send('Looking for map updates now.').then(msg => {msg.delete({timeout:3000})})
        setInterval( async () => {
            db.query(`SELECT * from bm_newmaps WHERE guildId = '${message.guild.id}'`, async (err, rows) => {
                if (err) throw err;
                let sql;

                const { guild } = message

                if (rows.length < 1) {
                    return
                }


                sql = `UPDATE bm_newmaps
                SET
                mapPostChannelId = '${message.channel.id}'

                WHERE guildId = '${message.guild.id}'
                `
                db.query(sql)

                const cssUrl = 'https://gamebanana.com/mods/cats/5568?api=SubmissionsListModule'
                let cssResponse = await axios.get(cssUrl)
                let res = cssResponse.data['_aCellValues']
                let imageId = res[0]['_sProfileUrl'].replace('https://gamebanana.com/mods/', '')
    
                // Variables for embed
                let mapPreviewImageLink = `https://gamebanana.com/mods/embeddables/${imageId}?type=large`
                let mapName = res[0]['_sName']
                let mapAuthor = res[0]['_aOwner']['_sUsername']
                let mapDL = res[0]['_sProfileUrl']
                let channelId = rows[0].mapPostChannelId === '0' ? message.channel.id : rows[0].mapPostChannelId

                let defChannel = guild.channels.cache.get(channelId)
    
    
               
                if (mapName != rows[0].mapName) {
                    sql = `UPDATE bm_newmaps
                    SET
                    mapName = '${mapName}',
                    mapAuthor = '${mapAuthor}',
                    mapDL = '${mapDL}',
                    mapPreviewImageLink = '${mapPreviewImageLink}'
                    `
    
                    db.query(sql)
    
                    const newMapEmbed = new Discord.MessageEmbed()
                    .setTitle(`New Map by ${mapAuthor}`)
                    .setURL(mapDL)
                    .setDescription('Counter-Strike: Source')
                    .setColor(config.colors.primary)
                    .addFields([
                        {
                            name: 'Map Name',
                            value: mapName,
                            inline: true
                        },
                        {
                            name: 'Download ✅',
                            value: mapDL,
                            inline: true
                        }
                    ])
                    .setTimestamp()
                    .setImage(mapPreviewImageLink)

                    
                    defChannel.send({ embed: newMapEmbed })
                } else {
                    return
                }
            }) 
        }, 3000)

        
    }
}