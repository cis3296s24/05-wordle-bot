const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_reveal')
        .setDescription('Purchase a feature to reveal the first letter in a game.'),
    async execute(interaction) {
        await interaction.reply('Congrats, you now have the first letter of the word revealed for game of your choice.');
    },
};