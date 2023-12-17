const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Collection, ActivityType  } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        client.user.setActivity('development.', { type: ActivityType.Watching });
        client.user.setStatus('dnd');

        // Construct and prepare an instance of the REST module
        const rest = new REST({version: "10"}).setToken(process.env.token);

        (async () => {
            try {
                if (process.env.build === "production") {
                    // get guild
                    const guild = await client.guilds.cache.get(process.env.live_guild_id);
                    guild.commands.set([]);
                    await rest.put(Routes.applicationCommands(process.env.client_id), {
                        body: commands,
                    });
                    console.log("Successfully registered commands globally.");
                } else {
                    //client.application.commands.set([]);
                    await rest.put(Routes.applicationGuildCommands(process.env.client_id, process.env.testing_guild_id), {
                        body: commands,
                    });
                    console.log("Successfully registered commands locally.");
                }
            } catch (err) {
                if (err) console.error(err); //if valid error
            }
        })();
    },
};
