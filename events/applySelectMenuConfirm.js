const { REST } = require("@discordjs/rest");
const { Routes, ButtonStyle } = require("discord-api-types/v10");
const { MessageEmbed, User, Guild, MessageActionRow, MessageSelectMenu, Modal, TextInputComponent, MessageButton } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        if (interaction.isModalSubmit()) {
            try {
                const guild = interaction.guild;
                const ApplyEmbed = new MessageEmbed()
                    .setColor("GOLD")
                    .setTitle("New application!")
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription("User information:")
                    .addFields(
                        { name: "Username:", value: interaction.member.user.username },
                        { name: "Applying for:", value: interaction.customId },
                        { name: `Q: ${interaction.components[0].components[0].customId}`, value: `A: ${interaction.components[0].components[0].value}` },
                        { name: `Q: ${interaction.components[1].components[0].customId}`, value: `A: ${interaction.components[1].components[0].value}` },
                        { name: `Q: ${interaction.components[2].components[0].customId}`, value: `A: ${interaction.components[2].components[0].value}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username });

                const closeBtn = new MessageActionRow().addComponents(new MessageButton().setCustomId("closeChannel").setLabel("Close").setStyle("DANGER"));

                // create ticket
                guild.channels
                    .create(`${interaction.member.user.username}-${interaction.customId}`)
                    .then((channel) => {
                        //channel.setParent("1125530283664486521");
                        channel.send({ content: `<@434760513377927188> <@685906051656057007> <@${interaction.member.user.id}>`, embeds: [ApplyEmbed], components: [closeBtn] });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                interaction.reply({
                    content: `Your application can be found at the top of the channel list.`,
                    ephemeral: true,
                });
            } catch (err) {
                console.error(err);
                const ErrorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("An error has popped up while executing interaction.")
                    .setDescription("Info:")
                    .addFields({ name: "Error code:", value: `${err}` }, { name: "Interaction:", value: interaction.commandName }, { name: "User:", value: interaction.member.user.username })
                    .setTimestamp();
                await interaction.reply({
                    embeds: [ErrorEmbed],
                    ephemeral: true,
                });
                //DM Xndr
                interaction.client.users.fetch("434760513377927188", false).then((user) => {
                    user.send({ embeds: [ErrorEmbed] });
                });
            }
        }
    },
};
