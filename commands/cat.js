const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, User, Guild } = require('discord.js')
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("gets a photo of a cat from /r/cats on reddit."),

    async execute(interaction) {
        let data = await fetch
        ("http://meme-api.herokuapp.com/gimme/cats").then(res => res.json())

        const MemeEmbed = new MessageEmbed()
            .setColor('PURPLE')
            .setTitle(data.title)
            .setURL(data.postLink)
            .setImage(data.url)
            .setDescription(data.ups+" Upvotes | by "+data.author)
            .setTimestamp()
            .setFooter({text: "Cat command."});

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('catbutton')
                .setLabel('I want another one')
                .setStyle('PRIMARY'),
        );
        
        await interaction.reply({ embeds: [MemeEmbed], components: [row]});

        //log into file
        const content = '\ncat command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}