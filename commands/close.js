//const {  } = require("@discordjs/builders");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { User, Guild } = require("discord.js");
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const embedToText = (embed) => {
    let embedText = '--- Embed ---\n';
    if (embed.title) embedText += `Title: ${embed.title}\n`;
    if (embed.description) embedText += `Description: ${embed.description}\n`;
    if (embed.url) embedText += `URL: ${embed.url}\n`;
    if (embed.fields.length > 0) {
        embedText += 'Fields:\n';
        embed.fields.forEach(field => {
            embedText += ` - ${field.name}: ${field.value}\n`;
        });
    }
    if (embed.footer) embedText += `Footer: ${embed.footer.text}\n`;
    if (embed.timestamp) embedText += `Timestamp: ${new Date(embed.timestamp).toLocaleString()}\n`;
    embedText += '--- End of Embed ---\n';
    return embedText;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Close a ticket.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (interaction.channel.name.includes("ticket")) {
            // get all messages
            const messages = await interaction.channel.messages.fetch();
            const reverseMessages = messages.reverse();
            
            // Write the messages to the log file
            let logData = `${interaction.channel.name}\n`;
            reverseMessages.forEach(message => {
                const logEntry = `[${Date(message.createdTimestamp * 1000)}] by ${message.author.username}: ${message.content}\n`;
                logData += logEntry;

                // Check if the message contains embeds
                if (message.embeds.length > 0) {
                    message.embeds.forEach(embed => {
                        logData += embedToText(embed);
                    });
                }
            });
            logData += `${interaction.member.user.username} has closed the ticket.`

            const LOG_FILE_PATH = path.join(__dirname, 'messageLogs.txt');

            // Ensure the log file exists, create it if not
            if (!fs.existsSync(LOG_FILE_PATH)) {
                fs.writeFileSync(LOG_FILE_PATH, '', (err) => {
                    if (err) console.error('Failed to create log file:', err);
                });
            }

            // Write the log data to the file
            fs.writeFileSync(LOG_FILE_PATH, logData, (err) => {
                if (err) console.error('Failed to write log file:', err);
            });


            const CloseEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Ticket Closed.")
                .setDescription(`${interaction.member.user.username} has closed a ticket.`)
                .addFields(
                    { name: "Ticket Name:", value: `${interaction.channel.name}` }
                )
                .setTimestamp()
                .setFooter({ text: `Close command | Requested by ${interaction.member.user.username}` });

            // get channel
            var id;
            // live or test
            if (process.env.build === "live") {
                id = process.env.live_logs_id;
            } else {
                id = process.env.testing_logs_id;
            }

            // Send the log file to the send channel
            const channel = interaction.client.channels.cache.get(id);
            await channel.send({ embeds: [CloseEmbed], files: [{ attachment: LOG_FILE_PATH, name: 'messageLogs.txt' }] });

            // Delete the log file from storage
            fs.unlink(LOG_FILE_PATH, (err) => {
                if (err) console.error('Failed to delete log file:', err);
            });

            await interaction.editReply("closing channel...")
            setTimeout(() => {
                interaction.channel.delete();
            }, 3000);
        } else {
            await interaction.editReply({ content: "unable to close this channel", ephemeral: true })
        }
    }
};
