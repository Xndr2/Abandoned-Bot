const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  User,
  Guild,
} = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("gets a meme from /r/memes on reddit.")
    .setDMPermission(false),

  async execute(interaction, client) {
    if (client.cooldowns.has(interaction.user.id)) {
      interaction.reply({
        content: "Please wait for the cooldown to end!",
        ephemeral: true,
      });
    } else {
      let data;

      do {
        data = await fetch("https://meme-api.com/gimme/memes").then((res) =>
          res.json()
        );
      } while (data.nsfw === "false");

      const MemeEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(data.title)
        .setURL(data.postLink)
        .setImage(data.url)
        .setDescription(data.ups + " Upvotes | by " + data.author)
        .setTimestamp()
        .setFooter({ text: "Meme command." });

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("memebutton")
          .setLabel("New Meme")
          .setStyle("SUCCESS")
      );

      await interaction.reply({ embeds: [MemeEmbed], components: [row] });

      // set cooldown
      client.cooldowns.set(interaction.user.id, true);
      setTimeout(() => {
        client.cooldowns.delete(interaction.user.id); //clear cooldown
      }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
    }

    //log into file
    const content =
      "\nmeme command executed by " +
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
