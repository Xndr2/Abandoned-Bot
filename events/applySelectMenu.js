const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { MessageEmbed, User, Guild, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        if (interaction.isSelectMenu()) {
            try {
                const modalForm = new Modal();
                const firstQuestion = new TextInputComponent().setLabel("Do you have any past experiences?").setCustomId("Do you have any past experiences?").setStyle("SHORT").setRequired(true);
                const secondQuestion = new TextInputComponent().setLabel("If so, please elaborate.").setCustomId("If so, please elaborate.").setStyle("PARAGRAPH").setRequired(false);
                const thirdQuestion = new TextInputComponent()
                    .setLabel("Do you understand that applying is voluntary?")
                    .setCustomId("Do you understand that applying is voluntary?")
                    .setStyle("SHORT")
                    .setRequired(true);

                if (interaction.values[0] == "tester") modalForm.setTitle("Application for Tester").setCustomId("Tester");
                else if (interaction.values[0] == "programmer") modalForm.setTitle("Application for Programmer").setCustomId("Programmer");
                else if (interaction.values[0] == "sounddesign") modalForm.setTitle("Application for Sound Designer").setCustomId("Sound Design");
                else if (interaction.values[0] == "modeler") modalForm.setTitle("Application for Modeler").setCustomId("Modeler");
                else if (interaction.values[0] == "moderator") modalForm.setTitle("Application for Moderator/Admin").setCustomId("Moderator");

                const firstRow = new MessageActionRow().addComponents(firstQuestion);
                const secondRow = new MessageActionRow().addComponents(secondQuestion);
                const thirdRow = new MessageActionRow().addComponents(thirdQuestion);
                modalForm.addComponents(firstRow, secondRow, thirdRow);
                interaction.showModal(modalForm);
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
