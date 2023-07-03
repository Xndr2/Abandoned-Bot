const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, User, Guild, MessageAttachment } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gnome")
        .setDescription("Gnome someone")
        .addUserOption((option) => option.setName("user").setDescription("Give the name of someone you want to gnome").setRequired(true))
        .setDMPermission(false),

    async execute(interaction) {
        if (interaction.client.cooldowns.has(interaction.user.id)) {
            interaction.reply({
                content: "Please wait for the cooldown to end!",
                ephemeral: true,
            });
        } else {
            const user = interaction.options.getUser("user");
            const image = new MessageAttachment("https://i.imgflip.com/4u7k6j.jpg");

            await interaction.reply({
                content: `${user}, you have been GNOMED. :joy:`,
                files: [image],
            });

            // set cooldown
            interaction.client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                interaction.client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, interaction.client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }

        //log into file
        const content = "\ndecide command executed by " + interaction.member.user.username + " at " + new Date().toLocaleString();
        const path = "Logs.txt";
        fs.writeFile(path, content, { flag: "a" }, (err) => {
            //append to file write at end of file
            if (err) {
                console.error(err);
            }
        });
    },
};
