const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("reply with pong").setDMPermission(false),

    async execute(interaction) {
        if (interaction.client.cooldowns.has(interaction.user.id)) {
            interaction.reply({
                content: "Please wait for the cooldown to end!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `PONG 🏓: Host Latency is ${Date.now() - interaction.createdTimestamp}ms.\nDiscord API Latency is ${Math.round(interaction.client.ws.ping)}ms`,
            });

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
