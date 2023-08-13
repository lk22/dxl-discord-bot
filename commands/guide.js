const {
    EmbedBuilder,
    SlashCommandBuilder,
    ModalBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Searches for a game in the DXL database')
    .addStringOption(option => option.setName('query')
      .setDescription('The query to search for')
      .setRequired(true)
    ),
    async execute(interaction) {
      // build the modal with query results
      const modal = new ModalBuilder()
        .setCustomId('dxlGuideModal')
        .setTitle('DXL Guide')

      // get the query from the interaction
      const query = interaction.options.getString('query');
      console.log(query)
    }
}