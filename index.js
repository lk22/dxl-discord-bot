const { 
  Client, 
  GatewayIntentBits, 
  WebhookClient, 
  EmbedBuilder
} = require('discord.js');
const Discord = require('discord.js');
const env = require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(parser.json());

app.listen(process.env.DXL_DISCORD_BOT_PORT, () => {
  console.log("Logged in as DXL Bot!");
});

/**
 * adding post route for discord
 */
app.post('/discord/informLanEvent', (req, res) => {
  console.log(req.body);

  // send the message to the webhook client with the message content
  const { content } = req.body;
  webhookClient.send(content);
  
  return res.status(200).send('OK');
});

const webhookClient = new WebhookClient({
  id: process.env.DXL_DISCORD_WEBHOOK_ID,
  token: process.env.DXL_DISCORD_WEBHOOK_TOKEN,
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildPresences,
	],
});

client.on('ready', () => {
  webhookClient.send('DXL bot is online');
});

let embedBuilder = new EmbedBuilder()
  .setColor('#0099ff')
  .setImage('https://danishxboxleague.dk/wp-content/uploads/2022/03/cropped-cropped-DXL-LOGO-Hjemmeside_192x192.png');

client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ( 'data' in command && 'execute' in command ) {
    client.commands.set(command.data.name, command);
    if ( command.once ) {
      client.once(command.name, (...args) => command.execute(...args));
    } else {
      client.on(command.name, (...args) => command.execute(...args));
    }
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.on('interactionCreate', async interaction => {
  if ( ! interaction.isChatInputCommand()) return false;

  if (interaction.isAutocomplete()) {
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
})

client.on('messageCreate', async message => {
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
      await message.reply({
        content: 'Jeg forstår ikke hvad du mener, prøv at skrive /help for at se en liste over kommandoer'
      });
    }
  }
});

client.login(process.env.DXL_DISCORD_BOT_TOKEN);
