const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reveal')
        .setDescription('Reveal the first letter of the word in your next  game.'),
    async execute(interaction) {
        await interaction.reply('Revealing the first letter of the word in your next game.');
    },
};