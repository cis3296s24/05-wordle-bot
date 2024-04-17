const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Display the current points of the user'),
    async execute(interaction) {
        await interaction.reply('You currently have 0 points.');
    },
};