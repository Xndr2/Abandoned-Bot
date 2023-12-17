// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { log } = require('node:console');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.token);