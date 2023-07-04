const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { MessageEmbed, User, Guild, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction) => {
        if (interaction.isButton()) {
            try {
                if (interaction.customId === "memebutton") {
                    // if button is the meme button
                    const command = interaction.client.commands.get("meme"); // get the meme command
                    if (!command) return;
                    await command.execute(interaction); //execute meme command again
                } else if (interaction.customId === "catbutton") {
                    // if button is the cat button
                    const command = interaction.client.commands.get("cat"); // ...
                    if (!command) return;
                    await command.execute(interaction);
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
                            value: interaction.commandName,
                        },
                        {
                            name: "User:",
                            value: interaction.member.user.username,
                        }
                    )
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
