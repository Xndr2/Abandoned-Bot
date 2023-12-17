const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-apply")
        .setDescription("send the application buttons here")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const ApplyEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Do you want to help make *Abandoned* a reality?")
            .setDescription("Select what you want to apply for in the button below."
            + "\n**Please note that moderators will take action if you misuse these tickets.**")
            .setTimestamp();

        const TeamSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("team_select")
            .setPlaceholder("Choose a role.")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Tester")
                    .setDescription("Get early access to releases and find bugs before they go live.")
                    .setValue("Tester"),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel("Story Writer")
                    .setDescription("Write the story and in-game lore or get into designing missions.")
                    .setValue("Story Writer"),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel("Programmer")
                    .setDescription("The programming team makes all the code for the game.")
                    .setValue("Programmer"),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel("Sound Designer")
                    .setDescription("The sound team creates music and sound effects.")
                    .setValue("Sound Designer"),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel("3D Modeler")
                    .setDescription("A 3D modeler creates the models and textures to use in game.")
                    .setValue(" 3D Modeler"),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel("Moderator")
                    .setDescription("Help moderate the Discord server.")
                    .setValue("Moderator"),
        )


        const row = new ActionRowBuilder()
            .addComponents(TeamSelectMenu);

        await interaction.reply({ embeds: [ApplyEmbed], components: [row] });
    },
};
