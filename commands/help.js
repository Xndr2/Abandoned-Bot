//const {  } = require("@discordjs/builders");
const { log } = require("console");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { User, Guild } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = import("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Gets a list of all my commands.")
        .setDMPermission(false),

    async execute(interaction) {

        const HelpEmbed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("Need help with anything?")
            .setDescription("Here is a list of all commands I can do.")
            .setTimestamp()
            .setFooter({ text: `Help command | Requested by ${interaction.member.user.username}` });

        let commands = interaction.client.commands;
        for (var command of commands) {
            if (command[1].data.default_member_permissions != PermissionFlagsBits.Administrator) {
                HelpEmbed.addFields({ name: "```" + `/${command[0]}` + "```", value: "```" + `${command[1].data.description}` + "```", inline: false });
            }
        }

        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            HelpEmbed.addFields({ name: "```Admin Commands```", value: "```yaml\nSince you are an admin you have access to more commands.\nSee them below.\n```", inline: false });
            HelpEmbed.addFields({ name: "```/set-apply```", value: "```Send the application buttons here```", inline: true });
            HelpEmbed.addFields({ name: "```/close```", value: "```ONLY USE THIS IN TICKETS! Deletes the channel if it contains ```", inline: true });
            HelpEmbed.addFields({ name: "```/reload```", value: "```Reloads the entire bot (WIP)```", inline: true });
        }

        await interaction.editReply({ embeds: [HelpEmbed] });
    }
};
