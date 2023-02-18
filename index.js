//setup
require("dotenv").config();
const fs = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const {MessageEmbed, Client, Intents, Collection, Interaction, Guild, Collector} = require("discord.js");
const { Search } = require("youtube-search");
const { Console } = require("console");
const internal = require("stream");
const { execute } = require("./commands/cat");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

fs.writeFile('Logs.txt', '\n\nBot started at '+ new Date().toLocaleString(), { flag: 'a' }, err => {if(err != null) console.log(err)}); //logs the start of the bot

//get commands from folder
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js")); //get all files that end with .js
const commands = []; //make an array for the commands
client.commands = new Collection(); //new collection
for(const file of commandFiles){
    const command = require(`./commands/${file}`); //run command file
    commands.push(command.data.toJSON()); //add command to array and to collection
    client.commands.set(command.data.name, command);
}

// create cooldown for commands
client.cooldowns = new Collection();
client.COOLDOWN_SECONDS = 5;

// when ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("development.", {
        type: "WATCHING",
      });
      fs.writeFile('Logs.txt', '\nset status to watching', { flag: 'a' }, err => {if(err != null) console.log(err)}); //logs status

      //register commands
      const CLIENT_ID = client.user.id;
      const rest = new REST({ //make new rest (enable commands)
        version: "10"
      }).setToken(process.env.TOKEN);

      (async () =>{
        try{
            if(process.env.BUILD === "production") {
                // get guild
                const guild = await client.guilds.cache.get(process.env.GUILD_ID);
                guild.commands.set([]);
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Succesfully registered commands globally.");
                //logs commands globally
                fs.writeFile('Logs.txt', '\nSuccesfully registered commands globally. '+ new Date().toLocaleString(), { flag: 'a' }, err => {if(err != null) console.log(err)});

            }else{
                client.application.commands.set([]);
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                    body: commands
                });
                console.log("Succesfully registered commands locally.");
                 //logs commands locally
                fs.writeFile('Logs.txt', '\nSuccesfully registered commands locally. '+ new Date().toLocaleString(), { flag: 'a' }, err => {if(err != null) console.log(err)});
            }
        } catch(err){
            if(err) console.error(err); //if valid error
        }
      })();
});

//call commands
client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()){ //make sure interaction is valis command
        const command = client.commands.get(interaction.commandName);
        
        if(!command) return;
        try {
            await command.execute(interaction, client);
        } catch (err) {
            if(err) console.error(err); //if valid error
            const ErrorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle(":warning: An error has accured while executing interaction. :warning:")
                .setDescription("Please contact <@434760513377927188> with a screenshot.")
                .addField("error code:", `${err}`)
                .setTimestamp()
                .setFooter({text: "Error Triggered!"});
            await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
        }
    }
    
    if(interaction.isButton()){ //make sure interaction is valid button
        try {
            if(interaction.customId === 'memebutton') // if button is the meme button
            {
                const command = client.commands.get("meme"); // get the meme command
                if(!command) return;
                await command.execute(interaction, client); //execute meme command again
            }
            else if(interaction.customId === "catbutton") // if button is the cat button
            {
                const command = client.commands.get("cat"); // ...
                if(!command) return;
                await command.execute(interaction, client);
            }
        }
        catch (err) {
            if(err) //if valid error
            {
                console.error(err);
                // error embed
                const ErrorEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(":warning: An error has accured while executing interaction. :warning:")
                    .setDescription("Please contact <@434760513377927188> with a screenshot.")
                    .addField("error code:", `${err}`)
                    .setTimestamp()
                    .setFooter({text: "Error Triggered!"});
                await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
            }
        }
    }
});

client.login(process.env.TOKEN);