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

client.login(process.env.TOKEN);
