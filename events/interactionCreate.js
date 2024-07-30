const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, User, Guild } = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        //await interaction.reply({ content: "Working on it.", ephemeral: true });
        try {
            //make sure interaction is valid command
            if (interaction.isChatInputCommand()) {
                await interaction.deferReply();
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction);
            } else if (interaction.isButton()) {
                await interaction.deferReply();
                const command = interaction.client.commands.get(interaction.customId);
                if (!command) return;
                await command.execute(interaction);
            } else if (interaction.isStringSelectMenu()) {
                if (interaction.customId === "team_select") {
                    const command = interaction.client.commands.get("open-select-menu");
                    if (!command) return;
                    await command.execute(interaction);
                }
            } else if (interaction.isModalSubmit()) {
                await interaction.reply({ content: "Working on it.", ephemeral: true });
                if (interaction.customId.includes("team_modal")) {
                    const command = interaction.client.commands.get("confirm-select-menu");
                    if (!command) return;
                    await command.execute(interaction);
                }
            }
        } catch (err) {
            const ErrorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("An error has popped up while executing interaction.")
                .setDescription("Xndr has been informed.")
                .addFields(
                    { name: "Error:", value: `${err}` },
                )
                .setTimestamp()
                .setFooter({ text: "Error" });

            // if (interaction) {
            //     ErrorEmbed.addFields(
            //         { name: "User:", value: `${interaction.member.user.username}` },
            //         { name: "Interaction:", value: `${interaction}` }
            //     )
            // } else {
            //     ErrorEmbed.addFields(
            //         { name: "User:", value: "Unknown" },
            //         { name: "Interaction:", value: "Unknown" }
            //     )
            // };

            await interaction.reply({
                embeds: [ErrorEmbed],
                ephemeral: true,
            });

            //DM Xndr
            interaction.client.users.fetch(process.env.owner_id, false).then((user) => {
                user.send({ embeds: [ErrorEmbed] });
            });
        }
    },
};
