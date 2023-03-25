const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("decide")
    .setDescription("Decide command")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Give an argument")
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction, client) {
    if (client.cooldowns.has(interaction.user.id)) {
      interaction.reply({
        content: "Please wait for the cooldown to end!",
        ephemeral: true,
      });
    } else {
      const string = interaction.options.getString("input");
      const messages = [
        "For sure",
        "No",
        "No question, Yes",
        "I am not autherized to tell you.",
        "No one knows",
        "Better ask yourself",
        "Maybe",
        "No question, No",
        "Don't count on it",
        "Perhaps",
        "Only Joe Biden can answer that",
        ":moyai:",
        "I wont answer",
        "ERoR.;!! QuEstIoN iS ToO hARd....",
        "Yes, indeed",
        "100% yea",
        "Water",
        "Think. What are your real priorities?",
        "Ask tomorrow",
        "Never",
        "Slow Down",
      ];
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      //await interaction.reply(randomMessage);

      const DecideEmbed = new MessageEmbed()
        .setColor("NOT_QUITE_BLACK")
        .setTitle(string + "  :eyes:")
        .setDescription(randomMessage)
        .setTimestamp()
        .setFooter({ text: "Decide command." });

      await interaction.reply({ embeds: [DecideEmbed] });

      // set cooldown
      client.cooldowns.set(interaction.user.id, true);
      setTimeout(() => {
        client.cooldowns.delete(interaction.user.id); //clear cooldown
      }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
    }

    //log into file
    const content =
      "\ndecide command executed by " +
      interaction.member.user.username +
      " at " +
      new Date().toLocaleString();
    const path = "Logs.txt";
    fs.writeFile(path, content, { flag: "a" }, (err) => {
      //append to file write at end of file
      if (err) {
        console.error(err);
      }
    });
  },
};
