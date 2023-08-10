const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with a list of commands')
    .addStringOption(
      option => option.setName('command')
        .setDescription('The command you want help with')
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    const embedBuilder = new EmbedBuilder()
      .setTitle('DXL Bot Kommandoer')
      .setDescription('Her er en liste over alle kommandoer jeg kender')
      .setImage('https://danishxboxleague.dk/wp-content/uploads/2022/03/cropped-cropped-DXL-LOGO-Hjemmeside_192x192.png')
      .setFields(
        {name: '/ping', value: 'Tests if the bot is online'},
        {name: '/invite', value: 'Replies with the invite link for the discord server'},
        {name: '/membership', value: 'Replies with the membership link for danishxboxleague.dk'},
        {name: '/faq', value: 'Replies with a list of freqently asked questions'}
      )

    await interaction.reply({
      embeds: [embedBuilder]
    });
  }
}