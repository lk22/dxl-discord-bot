const {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Replies with a list of freqently asked questions'),
  async execute(interaction) {
    await interaction.reply({
      content: 'Her er en liste over ofte stillede spørgsmål',
      embeds: [{
        title: 'Få svar på DXL"s ofte stillede spørgsmål',
        description: 'Her er en liste over ofte stillede spørgsmål',
        color: 0x00ff00,
        fields: [
          {
              name: 'Hvordan bliver jeg medlem af foreningen?',
              value: 'Du kan blive medlem ved at benytte dette link https://danishxboxleague.dk/bliv-medlem'
          },
          {
              name: 'Hvad koster et medlemsskab?',
              value: 'Et medlemsskab koster 500 kr. om året, og løber fra 1. Januar til 31. December og 300 pr halvår'
          },
          {
            name: 'Hvor tit er der LAN events?',
            value: "Der bliver afhold LAN events 2 gange om året, typisk i April og i Oktober, hvert LAN har en varighed på en weekend fra Fredag til Søndag"
          }
        ]
      }]
    });
  }
}