const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("version").setDescription("gets the latest game version from github").setDMPermission(false),

    async execute(interaction, octokit) {
        if (interaction.client.cooldowns.has(interaction.user.id)) {
            interaction.reply({
                content: "Please wait for the cooldown to end!",
                ephemeral: true,
            });
        } else {
            const response = await octokit.request("GET /repos/{owner}/{repo}/releases/latest", {
                owner: "Xndr2",
                repo: "Abandoned-Releases",
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });

            const VersionEmbed = new MessageEmbed();
            if (response.status == 200) {
                VersionEmbed.setColor("WHITE");
                VersionEmbed.setTitle("Here is the latest version of the game.");
                VersionEmbed.setDescription(response.data.name);
                VersionEmbed.addField("Link:", response.data.html_url);
                VersionEmbed.addField("Info:", response.data.body);
                VersionEmbed.setTimestamp();
                VersionEmbed.setFooter({ text: "Version command." });
            } else {
                VersionEmbed.setColor("RED");
                VersionEmbed.setTitle("Unable to get latest version!");
                VersionEmbed.setDescription("Github API did not respond.");
                VersionEmbed.setTimestamp();
                VersionEmbed.setFooter({ text: "Version command error." });
            }

            await interaction.reply({ embeds: [VersionEmbed] });

            // set cooldown
            interaction.client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                interaction.client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, interaction.client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }

        //log into file
        const content = "\nping command executed by " + interaction.member.user.username + " at " + new Date().toLocaleString();
        const path = "Logs.txt";
        fs.writeFile(path, content, { flag: "a" }, (err) => {
            //append to file write at end of file
            if (err) {
                console.error(err);
            }
        });
    },
};
