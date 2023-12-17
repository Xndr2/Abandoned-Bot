const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { User, Guild } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check how fast I really am.')
		.setDMPermission(false),
		
	async execute(interaction) {
		const PingEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("PONG 🏓")
            .setDescription("Bot Status:")
			.addFields(
				{ name: "Host Latency:", value: `${Date.now() - interaction.createdTimestamp}ms` },
				{ name: "Discord API Latency:", value: `${Math.round(interaction.client.ws.ping)}ms` }
			)
            .setTimestamp()
            .setFooter({ text: `Ping command | Requested by ${interaction.member.user.username}` });

        await interaction.reply({ embeds: [PingEmbed] });
	},
};