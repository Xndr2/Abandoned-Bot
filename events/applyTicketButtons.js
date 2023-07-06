const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { MessageEmbed, User, Guild, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        if (interaction.isButton()) {
            try {
                if (interaction.customId === "closeChannel") {
                    // close ticket
                    interaction.reply("Closing Application! Please stand by...");
                    setTimeout(() => {
                        // delete channel
                        const fetchedChannel = interaction.guild.channels.cache.get(interaction.channel.id);
                        fetchedChannel.delete();
                        return interaction.deleteReply().catch(() => {});
                    }, 5000);
                }
            } catch (err) {
                console.error(err);
                const ErrorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("An error has popped up while executing interaction.")
                    .setDescription("Info:")
                    .addFields(
                        { name: "Error code:", value: `${err}` },
                        {
                            name: "Interaction:",
                            value: interaction,
                        },
                        {
                            name: "User:",
                            value: interaction.member.user.username,
                        }
                    )
                    .setTimestamp();
                await interaction.reply({ embeds: [ErrorEmbed] });
                //DM Xndr
                interaction.client.users.fetch("434760513377927188", false).then((user) => {
                    user.send({ embeds: [ErrorEmbed] });
                });
            }
        }
    },
};
