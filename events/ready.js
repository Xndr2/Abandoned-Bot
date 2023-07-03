const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Collection } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity("development.", {
            type: "WATCHING",
        });
        fs.writeFile(
            "Logs.txt",
            "\nset status to watching",
            {
                flag: "a",
            },
            (err) => {
                if (err != null) console.log(err);
            }
        ); //logs status

        //register commands
        const CLIENT_ID = client.user.id;
        const rest = new REST({
            //make new rest (enable commands)
            version: "10",
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.BUILD === "production") {
                    // get guild
                    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
                    guild.commands.set([]);
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands,
                    });
                    console.log("Succesfully registered commands globally.");
                    //logs commands globally
                    fs.writeFile(
                        "Logs.txt",
                        "\nSuccesfully registered commands globally. " + new Date().toLocaleString(),
                        {
                            flag: "a",
                        },
                        (err) => {
                            if (err != null) console.log(err);
                        }
                    );
                } else {
                    client.application.commands.set([]);
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commands,
                    });
                    console.log("Succesfully registered commands locally.");
                    //logs commands locally
                    fs.writeFile(
                        "Logs.txt",
                        "\nSuccesfully registered commands locally. " + new Date().toLocaleString(),
                        {
                            flag: "a",
                        },
                        (err) => {
                            if (err != null) console.log(err);
                        }
                    );
                }
            } catch (err) {
                if (err) console.error(err); //if valid error
            }
        })();
    },
};
