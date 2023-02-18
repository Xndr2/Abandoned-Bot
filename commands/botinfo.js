const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, User, Guild } = require('discord.js')
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
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
                .setDescription("This bot is made by Xndr for [Abandoned](https://discord.gg/CAhVGsAW7H)")
                .addField("Version:", "1.0", true)
                .addField("Author:", "Xndr", true)
                .addField("Global Command Cooldown:", "5 seconds")
                .addField("Guilds I'm in:", `${client.guilds.cache.size}`)
                .addField("Users in my chache:", `${client.users.cache.size}`)
                .addField("Channels I have access to:", `${client.channels.cache.size}`)
                .addField("Commands I can run:", `${client.commands.size}`)
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