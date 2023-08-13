

/**
 * Check if the interaction type is a autocomplete interaction and if it is, then execute the command
 * @param {*} interaction 
 * @returns 
 */
async function checkIsAutocompleteInteraction(interaction) {
  if ( ! interaction.isAutocomplete() ) return false;
  
  if ( interaction.isAutocomplete() ) {
    const command = interaction.client.commands.get(interaction.commandName);

    if ( ! command ) {
      console.log(`[WARNING] The command ${interaction.commandName} does not exist`);
      return false;
    }

    try {
      await command.execute(interaction);
    } catch(error) {
      console.error(error);
    }
  }
}

/**
 * Cheking if the interaction is a chat input command interaction and if it is, then execute the command
 * @param {object} interaction 
 * @returns 
 */
async function checkChatInputCommandInteraction(interaction) {
  if ( ! interaction.isChatInputCommand() ) return false;

  if ( interaction.isChatInputCommand() ) {
    const command = interaction.client.commands.get(interaction.commandName);

    if ( ! command ) {
      console.log(`[WARNING] The command ${interaction.commandName} does not exist`);
      return false;
    }

    try {
      await command.execute(interaction);
    } catch(error) {
      console.error(error);
    }
  }
}

async function triggerChatCommand(message, client, webhookClient) {
  // if the message starts with DXL and the bot is not the author
  if ( message.content.startsWith('/') && !message.author.bot ) {
    // split the message into an array of words
    const args = message.content.split(' ');
    // remove the second word from the array and store it in the command variable
    const command = args.shift().slice(1);

    if ( command ) {
      const commandFile = client.commands.get(command);
      commandFile.execute(message, args)
    } else {
      await webhookClient.send('Jeg kender ikke til denne kommando, prøv at skrive /help for at se en liste over kommandoer jeg kender');
    }
  }
}

module.exports = {
  checkIsAutocompleteInteraction,
  checkChatInputCommandInteraction,
  triggerChatCommand
}
