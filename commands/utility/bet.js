const { SlashCommandBuilder } = require('discord.js');
let wageredAmount;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Allows users to wager points on the game.'),
    async execute(interaction) {
        await interaction.reply('Wager points. Beware: you may double your points or lose what you wagered.');
        const userMessage = interaction.options.getString('message');
        // Check if the wagered amount is a valid number
        if (isNaN(wageredAmount)) {
            return wageredAmount = parseInt(userMessage);
        }
        console.log(wageredAmount);
    },
};