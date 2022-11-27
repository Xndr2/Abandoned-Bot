const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, User, Guild } = require('discord.js')
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Gives you information about the server.")
        .setDMPermission(false),

    async execute(interaction, client) {
        const guild = interaction.guild;
        const memberCount = guild.members.cache.size;
        const owner = await guild.fetchOwner();

        const ServerInfoEmbed = new MessageEmbed()
            .setColor('DARK_PURPLE')
            .setTitle("Information about this server.")
            .setThumbnail(`${guild.iconURL()}`)
            .setDescription("This bot is made by Xndr for [TFL](https://discord.gg/E6Wv4jpHHj) and is used for entertainment purposes only.")
            .addField("Server ID", `${guild.id}`)
            .addField("Server Name", `${guild.name}`)
            .addField("Server Owner", `${owner}`)
            .addField("Server Created", `${guild.createdAt}`)
            .addField("Users in this server", `${memberCount}`)
            .addField("Channels in this server", `${guild.channels.cache.size}`)
            .addField("Roles in this server", `${guild.roles.cache.size}`)
            .addField("Server Icon URL", `${guild.iconURL()}`)
            .setTimestamp()
            .setFooter({text: "Server info command."});
        
        await interaction.reply({ embeds: [ServerInfoEmbed]});

        //log into file
        const content = '\nserverinfo command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}