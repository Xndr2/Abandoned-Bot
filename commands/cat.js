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
    .setName("cat")
    .setDescription("gets a photo of a cat from /r/cats on reddit.")
    .setDMPermission(false),

  async execute(interaction, client) {
    if (client.cooldowns.has(interaction.user.id)) {
      interaction.reply({
        content: "Please wait for the cooldown to end!",
        ephemeral: true,
      });
    } else {
      let data = await fetch("https://meme-api.com/gimme/catpics").then((res) =>
        res.json()
      );

      const CatEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(data.title)
        .setURL(data.postLink)
        .setImage(data.url)
        .setDescription(data.ups + " Upvotes | by " + data.author)
        .setTimestamp()
        .setFooter({ text: "Cat command." });

      const button = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("catbutton")
          .setLabel("I want another one")
          .setStyle("SUCCESS")
      );

      await interaction.reply({ embeds: [CatEmbed], components: [button] });

      // set cooldown
      client.cooldowns.set(interaction.user.id, true);
      setTimeout(() => {
        client.cooldowns.delete(interaction.user.id); //clear cooldown
      }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
    }

    //log into file
    const content =
      "\ncat command executed by " +
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
