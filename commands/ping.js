const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("reply with pong"),

    async execute(interaction, client) {
            await interaction.reply({ content: `PONG: 🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms` })

            //log into file
            const content = '\nping command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
            const path = 'Logs.txt';
            fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
                if (err) {
                  console.error(err);
                }
            });
    }
}