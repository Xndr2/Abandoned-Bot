const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageEmbed, Collection, Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const search = require("youtube-search");
const fs = require('fs');
const opts = {   //options for youtube search
    maxResults: 1,
    key: process.env.YOUTUBE_API,
    type: "video"
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sotd")
        .setDescription("Makes the SOTD announcement.")
        .addStringOption(option =>( 
            option.setName('song')
                .setDescription('Give the song name.')
                .setRequired(true))
        ),

    async execute(interaction, client) {
        if(interaction.member.roles.cache.has('880832571255181322') || interaction.member.roles.cache.has('936990096295591978') || process.env.NEED_PERMISSION == "false") //check if user has the management role
        {
            if(interaction.channel.id === '981262669212422194' || process.env.NEED_PERMISSION == "false") //check channel
            {
                const query = interaction.options.getString('song'); //get song name
                let results = await search(query, opts); //search youtube for song
                if(results){
                    let resultsArray = results.results; //get results array

                    const title = resultsArray[0].title
                    const link = resultsArray[0].link
                    const SOTDEmbed = new MessageEmbed()
                        .setColor('GOLD')
                        .setTitle(":notes: SOTD")
                        .setURL(link) //set url to youtube video
                        .setDescription("Opinions can be posted in thread below. :arrow_heading_down:")
                        .setThumbnail(resultsArray[0].thumbnails.default.url.toString())
                        .addField(title, link) //add songs to embed
                        .setTimestamp()
                        .setFooter({text: "SOTD command."})


                    await interaction.channel.send("<@&981482072428404736>") //ping SOTD
                    await interaction.reply({ embeds: [SOTDEmbed], fetchReply: true }).then(async (message) => {
                        const thread = await message.startThread({ //make thread
                            name: resultsArray[0].title,
                            autoArchiveDuration: 60,
                            reason: 'Thread to answer in.',
                        })
                        if (thread.joinable) await thread.join(); //join thread
                        await thread.members.add(interaction.member.user.id); //add user to thread
                    });
                }
            } else await interaction.reply({ content: "You can not activate the command in this channel.", ephemeral: true})
        } else //if user does not have role
            await interaction.reply({ content: "You can not activate this command. Your actions are logged.", ephemeral: true})


        //log into file
        const content = '\nSOTD command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}