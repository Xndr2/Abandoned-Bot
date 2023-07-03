const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Help command").setDMPermission(false),

    async execute(interaction) {
        if (interaction.client.cooldowns.has(interaction.user.id)) {
            interaction.reply({
                content: "Please wait for the cooldown to end!",
                ephemeral: true,
            });
        } else {
            const HelpEmbed = new MessageEmbed()
                .setColor("WHITE")
                .setTitle("List of all Commands.")
                .setDescription("All commands are logged! Don't abuse them!")
                .addField("/help", "Gives you all possible commands.")
                .addField("/decide [input]", "Gives you an awnser to you hardest question.")
                .addField("/ping", "Replies with host latency and the API latency.")
                .addField("/meme", "Gets a meme from /r/memes on reddit.")
                .addField("/cat", "Gets a cool cat pic from /r/cats.")
                .addField("/botinfo", "Gives you information about the bot.")
                .addField("/serverinfo", "Gives you information about the server.")
                .addField("/installation", "Shows you how to install the game.")
                .addField("/diy", "Do it yourself.")
                .addField("/gnome [user]", "Gnome someone in the server.")
                .setTimestamp()
                .setFooter({ text: "Help command." });

            await interaction.reply({ embeds: [HelpEmbed] });

            // set cooldown
            interaction.client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                interaction.client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, interaction.client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }

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
