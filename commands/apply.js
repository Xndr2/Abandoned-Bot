const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, User, Guild, PermissionFlagsBits, MessageActionRow, MessageSelectMenu } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("set-apply").setDescription("send the application buttons here").setDMPermission(false).setDefaultMemberPermissions(0),

    async execute(interaction) {
        const ApplyEmbed = new MessageEmbed()
            .setColor("WHITE")
            .setTitle("You want to help make Abandoned a reality?")
            .setDescription("Select the team you want to apply for in the button below.")
            .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("applyselection")
                .setPlaceholder("Select a team!")
                .addOptions([
                    {
                        label: "Tester",
                        description: "Get early access to releases and find bugs before they go live.",
                        value: "tester",
                    },
                    {
                        label: "Programming",
                        description: "The programming team makes all the code for the game.",
                        value: "programmer",
                    },
                    {
                        label: "Sound Design",
                        description: "The sound team creates music and sound effects.",
                        value: "sounddesign",
                    },
                    {
                        label: "Modeling",
                        description: "A 3D modeler creates the models and textures to use in game.",
                        value: "modeler",
                    },
                    {
                        label: "Moderation",
                        description: "Help moderate the Discord server.",
                        value: "moderator",
                    },
                ])
        );

        await interaction.reply({ embeds: [ApplyEmbed], components: [row] });

        // set cooldown
        interaction.client.cooldowns.set(interaction.user.id, true);
        setTimeout(() => {
            interaction.client.cooldowns.delete(interaction.user.id); //clear cooldown
        }, interaction.client.COOLDOWN_SECONDS * 1000); // after ... seconds

        //log into file
        const content = "\nhelp command executed by " + interaction.member.user.username + " at " + new Date().toLocaleString();
        const path = "Logs.txt";
        fs.writeFile(path, content, { flag: "a" }, (err) => {
            //append to file write at end of file
            if (err) {
                console.error(err);
            }
        });
    },
};
