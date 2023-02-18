const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, User, Guild } = require('discord.js')
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("installation")
        .setDescription("how do I install the game?")
        .setDMPermission(false),
            
    async execute (interaction, client) {
        if(client.cooldowns.has(interaction.user.id))
        {
            interaction.reply({ content: "Please wait for the cooldown to end!", ephemeral: true});
        }
        else
        {
            const installEmbed = new MessageEmbed()
                .setColor('NOT_QUITE_BLACK')
                .setTitle("How do I install the game?")
                .setDescription("There are 2 ways on how you can install the game.\n It is recommended to use the 1st one.\nClick [here](https://discord.com/channels/972478717232304138/1066649511637811270/1066659470983303249) or navigate to <#1066649511637811270> and scroll up.")
                .addField("Option 1:", "Automatic Installation", true)
                .addField("Option 2:", "Manual Installation", true)
                .setTimestamp()
                .setFooter({text: "Installation command."})
        
        
            await interaction.reply({ embeds: [installEmbed] });

            // set cooldown
            client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                client.cooldowns.delete(interaction.user.id); //clear cooldown
            }, client.COOLDOWN_SECONDS * 1000); // after ... seconds
        }
        

        //log into file
        const content = '\ninstallation command executed by '+ interaction.member.user.username + ' at ' + new Date().toLocaleString();
        const path = 'Logs.txt';
        fs.writeFile(path, content, { flag: 'a' }, err => { //append to file, write at end of file
            if (err) {
              console.error(err);
            }
        });
    }
}