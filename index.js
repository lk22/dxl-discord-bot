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

const utilities = require('./utils.js');

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

// load interaction create event
client.on('interactionCreate', async interaction => {
  await utilities.checkChatInputCommandInteraction(interaction);
  await utilities.checkIsAutocompleteInteraction(interaction);
})

// show greeting message from bot when invited to a server
client.on('guildCreate', async guild => {
  console.log(`Joined ${guild.name} as ${client.user.tag}`);
  // send the message to the webhook client with the message content
  webhookClient.send(`Hej ${guild.name}! Jeg er DXL Bot og jeg er her for at hjælpe dig med at finde rundt på serveren. \n\n
    Hvis du har brug for hjælp, så skriv /help i en af kanalerne og jeg vil hjælpe dig. \n\n
    Hvis du har spørgsmål, så skriv til en af vores admins eller moderatorer. \n\n`
  );
})

// notify when a new member joins the server
client.on('guildMemberAdd', async member => {
  // send the message to the webhook client with the message content
  webhookClient.send(
    `Velkommen til Danish Xbox League's Discord Server ${member.user.username}!\n\n 
    Jeg er DXL Bot og jeg er her for at hjælpe dig med at finde rundt på serveren. \n\n 
    Hvis du har brug for hjælp, så skriv /help i en af kanalerne og jeg vil hjælpe dig. \n\n 
    Hvis du har spørgsmål, så skriv til en af vores admins eller moderatorer. \n\n 
    Hvis du vil invitere dine venner til serveren, så skriv /invite i en af kanalerne og jeg vil generere et link til dig. \n\n`
  )
});

client.on('messageCreate', async message => {
  // auto suggest commands when the user types /
  await utilities.triggerChatCommand(message, client, WebhookClient);
});

client.login(process.env.DXL_DISCORD_BOT_TOKEN);
