const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('medlemsskab')
    .setDescription('Generere et hurtig link til DXL medlemsskabs side'),
    async execute(interaction) {
      let embedding = new EmbedBuilder()
        .setColor('#0099ff')
        .setImage('https://danishxboxleague.dk/wp-content/uploads/2022/03/cropped-cropped-DXL-LOGO-Hjemmeside_192x192.png')
        .setTitle('DXL Medlemsskab')
        .setDescription('Hvis du ønsker at blive medlem af DXL, så kan du klikke på linket herunder')
        .setURL('https://danishxboxleague.dk/bliv-medlem/');

      await interaction.reply({
        embeds: [embedding]
      })
    }
}