const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const { User, Guild } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("decide")
        .setDescription("Can't make your mind up about something? Let me decide for you.")
        .addStringOption((option) => option.setName("input").setDescription("Give an argument").setRequired(true))
        .setDMPermission(false),

    async execute(interaction) {
        const inputStr = interaction.options.getString("input");
        const messages = [
            "For sure",
            "No",
            "No question, Yes",
            "I am not authorized to tell you.",
            "No one knows",
            "Better ask yourself",
            "Maybe",
            "No question, No",
            "Don't count on it",
            "Perhaps",
            "Only Joe Biden can answer that",
            ":moyai:",
            "I wont answer",
            "ERoR.;!! QuEstIoN iS ToO hARd....",
            "Yes, indeed",
            "100% yea",
            "Water",
            "Think. What are your real priorities?",
            "Ask tomorrow",
            "Never",
            "Slow Down",
            "Yes.",
            "Maybe.",
            "It is unclear at this time.",
            "Signs point to yes.",
            "Signs point to no.",
            "You should try again later.",
            "Absolutely.",
            "Absolutely not.",
            "Ask again later.",
            "Cannot predict now.",
            "Don't count on it.",
            "My sources say no.",
            "My sources say yes.",
            "Outlook not so good.",
            "Outlook good.",
            "Very doubtful.",
            "Without a doubt.",
            "Most likely.",
            "Better not tell you now.",
            "Concentrate and ask again.",
            "Reply hazy, try again.",
            "It is certain.",
            "It is decidedly so.",
            "As I see it, yes.",
            "As I see it, no.",
            "Cannot say now.",
            "Signs are pointing towards a positive outcome.",
            "Signs are pointing towards a negative outcome.",
            "You may rely on it.",
            "It is doubtful.",
            "The outlook is promising.",
            "The outlook is not promising.",
            "Very likely.",
            "Very unlikely.",
            "Absolutely positively.",
            "Absolutely not in a million years.",
            "Don't bet on it.",
            "All signs point to a favorable outcome.",
            "All signs point to an unfavorable outcome.",
            "Ask your cat.",
            "Flip a coin.",
            "Do or do not. There is no try.",
            "It depends on the phase of the moon.",
            "Ask your mom.",
            "The answer is 42.",
            "Magic 8-ball says: signs point to yes.",
            "Let's leave it to fate and see what happens.",
            "Why don't you ask the Magic Conch Shell?",
            "Shake the Magic 8-ball again and ask later.",
            "I can't decide, I'm just a bot!",
            "Roll a D20 and find out.",
            "Have you considered flipping a pancake instead?",
            "The stars say maybe.",
            "My crystal ball is cloudy, try again later.",
            "Sorry, I'm allergic to decisions.",
            "You decide! I'm on vacation.",
            "The answer is blowing in the wind.",
            "Let's ask the ghosts.",
            "The universe says no.",
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const title = interaction.member.user.username + " asked: " + inputStr;
        if (title.length < 256 && inputStr.length <= 200) {
            const DecideEmbed = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setTitle(title)
                .setDescription(randomMessage)
                .setTimestamp()
                .setFooter({ text: `Decide command | Requested by ${interaction.member.user.username}` });

            await interaction.editReply({ embeds: [DecideEmbed] });
        } else {
            await interaction.editReply({ content: "Please limit your question to 200 characters max.", ephemeral: true, })
        }
    },
};