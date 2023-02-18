const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, User, Guild } = require('discord.js')
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help command")
        .setDMPermission(false),
            
    async execute (interaction, client) {
        if(client.cooldowns.has(interaction.user.id))
        {
            interaction.reply({ content: "Please wait for the cooldown to end!", ephemeral: true});
        }
        else
        {
            const HelpEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setTitle("List of all Commands.")
                .setDescription("All commands are logged! Don't abuse them!")
                .addField("/help", "Gives you all possible commands.")
                .addField("/decide [input]", "Give you an awnser to you hardest question.")
                .addField("/ping", "replies with pong and the API latency.")
                .addField("/meme", "Gets a meme from /r/memes on reddit.")
                .addField("/cat", "get a cool cat pic from /r/cats.")
                .addField("/botinfo", "Gives you information about the bot.")
                .addField("/serverinfo", "Gives you information about the server.")
                .addField("/installation", "Shows you how to install the game.")
                .setTimestamp()
                .setFooter({text: "Help command."})
        
        
            await interaction.reply({ embeds: [HelpEmbed] });

            // set cooldown
            client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }
        

        //log into file
        const content = '\nhelp command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}