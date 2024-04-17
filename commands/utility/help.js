const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides manual page for game'),
    async execute(interaction) {
        await interaction.reply('Features include:\n\tUse /startwordle to begin the game.\n\tUse /leaderboard to display the highest win rates in the server.\n\tUse /daily to show available points.\n\tUse /streak to display the higest win streak in the server.\n\tUse /bet to wager points on a game.\n\tUse /points to check your current points.\n\tUse /shop to view shop features.\n\tUse /buy to buy from the shop.');
    },
};