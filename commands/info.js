const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, User, Guild } = require('discord.js')
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Gives you information about the bot.")
        .setDMPermission(false),

    async execute(interaction, client) {
        if(client.cooldowns.has(interaction.user.id))
        {
            interaction.reply({ content: "Please wait for the cooldown to end!", ephemeral: true});
        }
        else
        {
            const InfoEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle("Information about the bot.")
                .setThumbnail("https://cdn.discordapp.com/attachments/881195253992947773/989895227831627776/TFL_logo_Standard.png")
                .setDescription("This bot is made by Xndr for [TFL](https://discord.gg/E6Wv4jpHHj) and is used for entertainment purposes only.")
                .addField("Version", "1.2.5")
                .addField("Author", "Xndr")
                .addField("General Command Cooldown:", "10 seconds")
                .addField("Guilds", `${client.guilds.cache.size}`)
                .addField("Users", `${client.users.cache.size}`)
                .addField("Channels", `${client.channels.cache.size}`)
                .addField("Commands", `${client.commands.size}`)
                .setTimestamp()
                .setFooter({text: "info command."});
            
            await interaction.reply({ embeds: [InfoEmbed]});

            // set cooldown
            client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }

        

        //log into file
        const content = '\ninfo command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}