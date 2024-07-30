const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("installation").setDescription("how do I install the game?").setDMPermission(false),

    async execute(interaction) {
        const installEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("How do I install the game?")
            .setDescription("Currently you can not install the game. We have not released anything since the switch to Unreal Engine."
                + `\n\nWe will announce a new release in <#975389131045765141>. Also check <#973276424972681236> for when we release the new Launcher.`)
            .setTimestamp()
            .setFooter({ text: `Installation command | Requested by ${interaction.member.user.username}` });

        await interaction.editReply({ embeds: [installEmbed] });
    },
};
