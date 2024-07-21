const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle,
    SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder,
    TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Team } = require("discord.js");
const { User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("open-select-menu")
        .setDescription("opens the select menu")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        var title;
        if (interaction.values) {
            title = interaction.values[0];
        } else {
            title = "undefined."
        }

        const TeamModal = new ModalBuilder()
            .setTitle(`Application for ${title}`)
            .setCustomId(`team_modal_${title}`);

        const firstQuestion = new TextInputBuilder()
            .setCustomId("Do you have any past experiences?")
            .setLabel("Do you have any past experiences?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const secondQuestion = new TextInputBuilder()
            .setCustomId("If so, please elaborate.")
            .setLabel("If so, please elaborate.")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const thirdQuestion = new TextInputBuilder()
            .setCustomId("Do you understand that applying is voluntary?")
            .setLabel("Do you understand that applying is voluntary?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firstRow = new ActionRowBuilder()
            .addComponents(firstQuestion);

        const secondRow = new ActionRowBuilder()
            .addComponents(secondQuestion);

        const thirdRow = new ActionRowBuilder()
            .addComponents(thirdQuestion);

        TeamModal.addComponents(firstRow, secondRow, thirdRow);

        await interaction.showModal(TeamModal);
    },
};
