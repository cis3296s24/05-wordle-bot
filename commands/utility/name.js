const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('returns your discord name~'),
    async execute(interaction) {
        await interaction.reply(`Hi ${interaction.user.username}`);
    },
};