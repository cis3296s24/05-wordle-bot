const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Provides store items for game.'),
    async execute(interaction) {
        await interaction.reply('Use your points to buy:\n\tUse /extra_guess to buy an extra guess in a game for 100 points.\n\tUse /reveal to reveal the first letter of a word for 50 points.\nImportant: must use store items before starting the game you want to use the extra feature on.');
    },
};