const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Allows users to wager points on the game.'),
    async execute(interaction) {
        await interaction.reply('Wager points. Beware: you may double your points or lose what you wagered.');
    },
};