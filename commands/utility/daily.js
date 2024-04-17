const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('See the amount of points available for the day.'),
    async execute(interaction) {
        await interaction.reply('The amount of points available today is 10 points.');
    },
};