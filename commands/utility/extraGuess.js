const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('extra_guess')
        .setDescription('Use an extra guess for your next game.'),
    async execute(interaction) {
        await interaction.reply('Using an extra guess for your next game.');
    },
};