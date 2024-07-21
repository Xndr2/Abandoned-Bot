const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client, commands) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity('development.', { type: ActivityType.Watching });
		client.user.setStatus('dnd');

		(async () => {
			try {
				if (process.env.build === 'live') {
					// client.application.commands.set([]);
					console.log(`Started refreshing ${commands.length} application (/) commands GLOBALLY.`);

					// Construct and prepare an instance of the REST module
					const rest = new REST({ version: '10' }).setToken(process.env.live_token);

					// The put method is used to fully refresh all commands in the guild with the current set
					const data = await rest.put(
						Routes.applicationCommands(process.env.live_client_id),
						{ body: commands },
					);

					console.log(`Successfully reloaded ${data.length} application (/) commands GLOBALLY.`);
				}
				else {
					// client.application.commands.set([]);
					console.log(`Started refreshing ${commands.length} application (/) commands.`);

					// Construct and prepare an instance of the REST module
					const rest = new REST({ version: '10' }).setToken(process.env.test_token);

					// The put method is used to fully refresh all commands in the guild with the current set
					const data = await rest.put(
						Routes.applicationGuildCommands(process.env.test_client_id, process.env.test_server_id),
						{ body: commands },
					);

					console.log(`Successfully reloaded ${data.length} application (/) commands.`);
				}
			}
			catch (err) {
				// if valid error
				if (err) console.error(err);
			}
		})();
	},
};
