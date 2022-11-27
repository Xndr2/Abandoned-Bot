const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions, User, Guild,} = require('discord.js')
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jef")
        .setDescription("jef")
        .setDMPermission(false),
            
    async execute (interaction) {
        const DecideEmbed = new MessageEmbed()
            .setColor('DARK_NAVY')
            .setTitle("JEF")
            .setDescription("lol")
            .setTimestamp()
            .setFooter({text: "Jef command."})
        
        
        await interaction.reply({ embeds: [DecideEmbed] });

        //log into file
        const content = '\nJef command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}