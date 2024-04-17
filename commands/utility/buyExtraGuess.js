const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_extra_guess')
        .setDescription('Purchase an extra guess for game.'),
    async execute(interaction) {
        await interaction.reply('Congrats, you now have an extra guess for a game of your choice.');
    },
};