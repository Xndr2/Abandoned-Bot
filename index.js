// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// set up commands
// get commands from folder
//
// get all files that end with .js
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const commands = [];
// new collection
client.commands = new Collection();
for (const file of commandFiles) {
	// run command file
	const command = require(`./commands/${file}`);
	// add command to array and to collection
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

// set up event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login using the correct token
if (process.env.build === 'live') {
	client.login(process.env.live_token);
}
else {
	client.login(process.env.test_token);
}