const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("installation").setDescription("how do I install the game?").setDMPermission(false),

    async execute(interaction) {
        if (interaction.client.cooldowns.has(interaction.user.id)) {
            interaction.reply({
                content: "Please wait for the cooldown to end!",
                ephemeral: true,
            });
        } else {
            const installEmbed = new MessageEmbed()
                .setColor("WHITE")
                .setTitle("How do I install the game?")
                .setDescription("Follow these exact steps to install the latest version.\nYou will need to redo this with every update until there is an automatic update system in place.")
                .setImage(
                    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2Q0NjE4ZGMxZDVjZDY5NjAyZjI2YzhhNDhjMDEzYzIwYzU5MThkNCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/F4KfhQhqpc9BO5sjUE/giphy.gif"
                )
                .addField("**```Antivirus!```**", "```fix\nIf an anitvirus stops you from playing or deletes the files entirely. Make sure to add it to the exceptions of your anitvirus.\n```")
                .addField("**```Warning!```**", "**```diff\n-Keep in mind that the game is not optimized for low end devices. Any feedback on how the game runs is greatly appreciated.\n```**")
                .addField("Step 1:", "Head over to the [release page](https://github.com/Xndr2/Abandoned-Releases/releases).")
                .addField("Step 2:", "On this page there click on the first result that says 'latest'.")
                .addField("Step 3:", "Scrol down until you see 'Assests'.")
                .addField("Step 4:", "Click the .zip file. It should download automatically.")
                .addField("Step 5:", "After its downloaded [unzip](https://www.youtube.com/watch?v=Ep-L3PjBPCk) the file.")
                .addField("Step 6:", "Next find the .exe file and dubble click it.")
                .addField("Support:", "If you still need help please do not hesitate to contact us.")
                .setTimestamp()
                .setFooter({ text: "Installation command." });

            await interaction.reply({ embeds: [installEmbed] });

            // set cooldown
            interaction.client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                interaction.client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, interaction.client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }

        //log into file
        const content = "\ninstallation command executed by " + interaction.member.user.username + " at " + new Date().toLocaleString();
        const path = "Logs.txt";
        fs.writeFile(path, content, { flag: "a" }, (err) => {
            //append to file, write at end of file
            if (err) {
                console.error(err);
            }
        });
    },
};
