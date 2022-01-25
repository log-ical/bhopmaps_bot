import {Client, Intents } from 'discord.js';
const fs = require('fs')
const path = require('path')
const db = require('./database/db')
require('dotenv').config()

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', async () => {
    console.log('[Bhopmaps] client connected')
    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)
    const readCommands = dir => {

        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {

            const stat = fs.lstatSync(path.join(__dirname, dir, file))

            if (stat.isDirectory()) {
            readCommands(path.join(dir, file))

            } else if (file !== baseFile) {

                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
                
            }
        }
    }
    readCommands('commands')
})




// adding guildid to the table 
client.on('guildCreate', (guild) => {
    db.query(`INSERT INTO bm_newmaps (guildId, mapName, mapAuthor, mapDL, mapPreviewImageLink, mapPostChannelId) VALUES('${guild.id}', '0', '0', '0', '0', '0')`, (err) => {if (err) throw err;})
    console.log(`[Bhopmaps] guildId retrieved (${guild.id})`)
})
// Removing guildId if the server kicks bot
client.on('guildDelete', (guild) => {
    db.query(`DELETE FROM bm_newmaps WHERE guildId = '${guild.id}'`, (err) => {if (err) throw err;})
    console.log(`[Bhopmaps] Removed Server (${guild.id})`)
})



client.login(process.env.TOKEN)


