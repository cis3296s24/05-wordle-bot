const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the highest win rate in the server'),
    async execute(interaction) {
        await interaction.reply('The highest win rate in the server is UNKOWN.');
    },
};