const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow, User, Guild } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("diy").setDescription("do it yourself").setDMPermission(false),

    async execute(interaction, client) {
        if (client.cooldowns.has(interaction.user.id)) {
            interaction.reply({
                content: "Please wait for the cooldown to end!",
                ephemeral: true,
            });
        } else {
            const DiyEmbed = new MessageEmbed()
                .setColor("NAVY")
                .setTitle("Why is the dev so slow to make this game!?")
                .setDescription(
                    "Sounds like you know how video games are made, so you should just do it yourself!\n\n**You're in luck, Xndr is always looking for people to help make the game better.**\n\nHead over to <#998558850036797492> and fill out the application that you want.\nWe thank you for wanting to make this game more fun!"
                )
                .setImage("https://i.imgur.com/TO2uuRD.jpg")
                .setTimestamp()
                .setFooter({ text: "Diy command." });

            await interaction.reply({ embeds: [DiyEmbed] });

            // set cooldown
            client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }

        //log into file
        const content = "\ndiy command executed by " + interaction.member.user.username + " at " + new Date().toLocaleString();
        const path = "Logs.txt";
        fs.writeFile(path, content, { flag: "a" }, (err) => {
            //append to file write at end of file
            if (err) {
                console.error(err);
            }
        });
    },
};
