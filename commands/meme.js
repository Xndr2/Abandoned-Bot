const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, User, Guild } = require('discord.js')
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("gets a meme from /r/memes on reddit."),

    async execute(interaction) {
        let data = await fetch
        ("http://meme-api.herokuapp.com/gimme/memes").then(res => res.json())

        const MemeEmbed = new MessageEmbed()
            .setColor('PURPLE')
            .setTitle(data.title)
            .setURL(data.postLink)
            .setImage(data.url)
            .setDescription(data.ups+" Upvotes | by "+data.author)
            .setTimestamp()
            .setFooter({text: "Meme command."});

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('memebutton')
                .setLabel('New Meme')
                .setStyle('PRIMARY'),
        );
        
        await interaction.reply({ embeds: [MemeEmbed], components: [row]});

        //log into file
        const content = '\nmeme command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}