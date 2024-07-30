const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user that ran this command.')
		.setDMPermission(false),

	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.editReply(`This command was ran by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};