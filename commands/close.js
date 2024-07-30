//const {  } = require("@discordjs/builders");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { User, Guild } = require("discord.js");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Close a ticket.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (interaction.channel.name.includes("ticket")) {
            const CloseEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Ticket Closed.")
                .setDescription(`${interaction.member.user.username} has closed a ticket.`)
                .addFields(
                    { name: "Ticket Name:", value: `${interaction.channel.name}` }
                )
                .setTimestamp()
                .setFooter({ text: `Close command | Requested by ${interaction.member.user.username}` });

            // get channel
            var id;
            // live or test
            if (process.env.build === "live") {
                id = process.env.live_logs_id;
            } else {
                id = process.env.testing_logs_id;
            }

            const channel = interaction.client.channels.cache.get(id);
            channel.send({ embeds: [CloseEmbed] });

            await interaction.editReply("closing channel...")
            setTimeout(() => {
                interaction.channel.delete();
            }, 3000);
        } else {
            await interaction.editReply({ content: "unable to close this channel", ephemeral: true })
        }
    }
};
