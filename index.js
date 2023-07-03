//setup
require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { MessageEmbed, Client, Intents, Collection, partials, Interaction, Guild, Collector, Modal, TextInputComponent, MessageActionRow } = require("discord.js");
const { Search } = require("youtube-search");
const { Console } = require("console");
const internal = require("stream");
const path = require("path");
const client = new Client({
    intents: 32767,
});

// for making api calls to github
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({
    auth: process.env.OCTOKIT_TOKEN,
});

fs.writeFile(
    "Logs.txt",
    "\n\nBot started at " + new Date().toLocaleString(),
    {
        flag: "a",
    },
    (err) => {
        if (err != null) console.log(err);
    }
); //logs the start of the bot

// set up commands
//get commands from folder
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js")); //get all files that end with .js
const commands = []; //make an array for the commands
client.commands = new Collection(); //new collection
for (const file of commandFiles) {
    const command = require(`./commands/${file}`); //run command file
    commands.push(command.data.toJSON()); //add command to array and to collection
    client.commands.set(command.data.name, command);
}

// set up event files
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, octokit));
    }
}

// create cooldown for commands
client.cooldowns = new Collection();
client.COOLDOWN_SECONDS = 5;

//call commands
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        //make sure interaction is valid button
        try {
            if (interaction.customId === "memebutton") {
                // if button is the meme button
                const command = client.commands.get("meme"); // get the meme command
                if (!command) return;
                await command.execute(interaction); //execute meme command again
            } else if (interaction.customId === "catbutton") {
                // if button is the cat button
                const command = client.commands.get("cat"); // ...
                if (!command) return;
                await command.execute(interaction, client);
            }
        } catch (err) {
            if (err) {
                //if valid error
                console.error(err);
                // error embed
                const ErrorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(":warning: An error has accured while executing interaction. :warning:")
                    .setDescription("I will send Xndr a DM.")
                    .addField("error code:", `${err}`)
                    .setTimestamp()
                    .setFooter({ text: "Error Triggered!" });
                await interaction.reply({
                    embeds: [ErrorEmbed],
                    ephemeral: true,
                });
                //DM XNDR
                client.users.fetch("434760513377927188", false).then((user) => {
                    const ErrorDmEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle("An error has accured while executing interaction.")
                        .setDescription("Info:")
                        .addField("error code:", `${err}`)
                        .addField("interaction", "button, check console")
                        .addField("user", interaction.member.user.username)
                        .setTimestamp()
                        .setFooter({ text: interaction.member.user.username });
                    user.send({ embeds: [ErrorDmEmbed] });
                });
            }
        }
    }

    // select menu
    if (interaction.isSelectMenu()) {
        const modalForm = new Modal();
        const firstQuestion = new TextInputComponent().setLabel("Do you have any past experiences?").setCustomId("Do you have any past experiences?").setStyle("SHORT").setRequired(true);
        const secondQuestion = new TextInputComponent().setLabel("If so, please elaborate.").setCustomId("If so, please elaborate.").setStyle("PARAGRAPH").setRequired(false);
        const thirdQuestion = new TextInputComponent()
            .setLabel("Do you understand that applying is voluntary?")
            .setCustomId("Do you understand that applying is voluntary?")
            .setStyle("SHORT")
            .setRequired(true);

        if (interaction.values[0] == "tester") modalForm.setTitle("Application for Tester").setCustomId("Tester");
        else if (interaction.values[0] == "programmer") modalForm.setTitle("Application for Programmer").setCustomId("Programmer");
        else if (interaction.values[0] == "sounddesign") modalForm.setTitle("Application for Sound Designer").setCustomId("Sound Design");
        else if (interaction.values[0] == "modeler") modalForm.setTitle("Application for Modeler").setCustomId("Modeler");
        else if (interaction.values[0] == "moderator") modalForm.setTitle("Application for Moderator/Admin").setCustomId("Moderator");

        const firstRow = new MessageActionRow().addComponents(firstQuestion);
        const secondRow = new MessageActionRow().addComponents(secondQuestion);
        const thirdRow = new MessageActionRow().addComponents(thirdQuestion);
        modalForm.addComponents(firstRow, secondRow, thirdRow);
        interaction.showModal(modalForm);
    }

    if (interaction.isModalSubmit()) {
        const guild = interaction.guild;
        const ApplyEmbed = new MessageEmbed()
            .setColor("GOLD")
            .setTitle("New application!")
            .setThumbnail(`${guild.iconURL()}`)
            .setDescription("user information:")
            .addField("Username", interaction.member.user.username)
            .addField("Applying for", interaction.customId)
            .addField(interaction.components[0].components[0].customId, interaction.components[0].components[0].value)
            .addField(interaction.components[1].components[0].customId, interaction.components[1].components[0].value)
            .addField(interaction.components[2].components[0].customId, interaction.components[2].components[0].value)
            .setTimestamp()
            .setFooter({ text: interaction.member.user.username });
        //DM Xndr
        client.users.fetch("434760513377927188", false).then((user) => {
            user.send({ embeds: [ApplyEmbed] });
        });
        //DM Charles
        client.users.fetch("685906051656057007", false).then((user) => {
            user.send({ embeds: [ApplyEmbed] });
        });
        interaction.reply({
            content: "Your submission was received successfully!",
            ephemeral: true,
        });
    }
});

client.login(process.env.TOKEN);
