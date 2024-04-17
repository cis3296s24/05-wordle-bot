const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('Displays the highest win streak in the server and the user holding it.'),
    async execute(interaction) {
        await interaction.reply('The highest win streak is 0 by UNKOWN.');
    },
};