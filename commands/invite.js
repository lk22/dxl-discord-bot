const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Replies with the invite link for the discord server'),
  async execute(interaction) {
    // generate the invite link
    const inviteLink = await interaction.channel.createInvite({
      maxAge: 86400,
      maxUses: 10,
      unique: true,
      reason: 'DXL Server invitations link',
    })
    await interaction.reply({
      content: 'Here is the invite link: ' +process.env.DXL_DISCORD_INVITE_URL + "/" + inviteLink,
      ephemeral: true
    });
  }
}