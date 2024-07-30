const { ChannelType, PermissionsBitField, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { User, Guild } = require("discord.js");
const fs = require("fs");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("confirm-select-menu")
        .setDescription("Confirms the team select menu. Runs after pressing confirm.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        let team = interaction.customId.substring("team_modal_".length);
        const ConfirmEmbed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("New Application!")
            .setThumbnail(interaction.user.avatarURL())
            .setDescription("A moderator will help you shortly. Below are your answers to the questions we asked you."
                + "\n[For Admins: use `/close` to close this ticket.]")
            .setTimestamp();

        if (interaction.components) {
            ConfirmEmbed.addFields(
                { name: "Username:", value: interaction.member.user.username },
                { name: "Applying for:", value: team },
                { name: `Q: ${interaction.components[0].components[0].customId}`, value: `A: ${interaction.components[0].components[0].value}` },
                { name: `Q: ${interaction.components[1].components[0].customId}`, value: `A: ${interaction.components[1].components[0].value}` },
                { name: `Q: ${interaction.components[2].components[0].customId}`, value: `A: ${interaction.components[2].components[0].value}` }
            )
        } else {
            ConfirmEmbed.addFields(
                { name: "Error!", value: "Since you ran this via a command there are no answers to show.\nIf you want to test the ticket system use the correct channel and make a ticket." },
            )
        }

        const UserEmbed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("Thank you for your application!")
            .setDescription("Sit back while we review the answers you send in.\nYou can find your ticket:")
            .setTimestamp();

        // create channel
        const guild = interaction.guild;
        var id;
        if (process.env.build === "production") {
            id = process.env.live_ticket_category_id;
        } else {
            id = process.env.testing_ticket_category_id;
        }


        guild.channels.create({
            name: `ticket-${team}-${interaction.member.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }
            ],
            parent: id,
        }).then(async channel => {
            channel.send({ embeds: [ConfirmEmbed] });
            UserEmbed.addFields({ name: "Here", value: `<#${channel.id}>` });
            await interaction.editReply({ content: "", embeds: [UserEmbed], ephemeral: true });
            //interaction.user.send({ embeds: [UserEmbed] });
        });
        //await interaction.reply({ content: "Ticket made. Check your direct messages if you have them enabled.", ephemeral: true });
    },
};
