//const {  } = require("@discordjs/builders");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const { User, Guild } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = import("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Gets a photo of a cat from /r/cats on reddit.")
        .setDMPermission(false),

    async execute(interaction) {
        let isNSFW = true;
        let data;
        while(isNSFW) {
            data = await fetch("https://meme-api.com/gimme/catpics").then((res) => res.json());
            isNSFW = data.nsfw
        }

        const CatEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(data.title)
            .setURL(data.postLink)
            .setImage(data.url)
            .setDescription(data.ups + " Upvotes | by " + data.author)
            .setTimestamp()
            .setFooter({ text: `Cat command | Requested by ${interaction.member.user.username}` });

        const NextButton = new ButtonBuilder()
            .setCustomId("cat")
            .setLabel("Next Cat Pic")
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
            .addComponents(NextButton);
        
        //const button = new MessageActionRow().addComponents(new MessageButton().setCustomId("catbutton").setLabel("I want another one").setStyle("SUCCESS"));

        await interaction.reply({ embeds: [CatEmbed], components: [row] });
    }
};
