const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, User, Guild } = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        try {
            //make sure interaction is valid command
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction);
            } else if (interaction.isButton()) {
                const command = interaction.client.commands.get(interaction.customId);
                if (!command) return;
                await command.execute(interaction);
            } else if (interaction.isStringSelectMenu()) {
                if(interaction.customId === "team_select") {
                    const command = interaction.client.commands.get("open-select-menu");
                    if (!command) return;
                    await command.execute(interaction);
                }
            } else if (interaction.isModalSubmit()) {
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
                    { name: "User:", value: `${interaction.member.user.username}` },
                    { name: "Interaction:", value: `${interaction}` }
                )
                .setTimestamp()
                .setFooter({ text: "Error" });

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
