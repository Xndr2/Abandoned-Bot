//const {  } = require("@discordjs/builders");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const { User, Guild } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = import("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Shows a funny meme from /r/memes on reddit.")
        .setDMPermission(false),

    async execute(interaction) {
        let isNSFW = true;
        let data;
        while (isNSFW) {
            data = await fetch("https://meme-api.com/gimme/memes").then((res) => res.json());
            isNSFW = data.nsfw
        }

        const MemeEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(data.title)
            .setURL(data.postLink)
            .setImage(data.url)
            .setDescription("<:Upvote:1184212705440174141> " + data.ups + " | by " + data.author)
            .setTimestamp()
            .setFooter({ text: `Meme command | Requested by ${interaction.member.user.username}` });

        const NextButton = new ButtonBuilder()
            .setCustomId("meme")
            .setLabel("Next Meme")
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
            .addComponents(NextButton);

        await interaction.editReply({ embeds: [MemeEmbed], components: [row] });
    }
};
