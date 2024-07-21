const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const { User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("diy")
        .setDescription("Do it yourself. Show this when someone complains about the game.")
        .setDMPermission(false),

    async execute(interaction) {
        const DiyEmbed = new EmbedBuilder()
            .setColor("Navy")
            .setTitle("'Why are the devs so slow at making this game!?'")
            .setDescription(
                "Sounds like you know how video games are made, so you should just do it yourself!\n\n**You're in luck! Headshot Interactive are always looking for people to help make the game better.**\n\nHead over to <#998558850036797492> and fill out the application that you want.\nWe thank you for wanting to make this game more fun!"
            )
            .setImage("https://imgur.com/a/ChuExFw")
            .setTimestamp()
            .setFooter({ text: `Cat command | Requested by ${interaction.member.user.username}` });

        await interaction.reply({ embeds: [DiyEmbed] });
    }
};