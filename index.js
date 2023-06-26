const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
const env = require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const commands = require('./commands');
const axios = require('axios');

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


const app = express();
app.use(parser.json());


app.listen(3000, () => {
  console.log("Logged in as DXL Bot!");
});

app.post('/discord', (req, res) => {
  console.log(req.body);

  // send the message to the webhook client with the message content
  const { content } = req.body;
  webhookClient.send(content);
  
  return res.status(200).send('OK');
})



client.on('messageCreate', async message => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }

  if (message.content === '!test') {
    message.reply('Test!');
    axios.get('http://localhost:8888/dxl-v2/wp-json/dxl/api/v1/event/list')
    .then(function (response) {
      console.log(response.data.data.response.events.lan)
      
    })
  }

  if ( message.content === "!invite" ) {
    try {
      const inviteLink = await message.channel.createInvite({
        maxAge: 84600,
        maxUses: 10
      });
      message.reply('Here is the invite link: ' +process.env.DXL_DISCORD_INVITE_URL + "/" + inviteLink);
    } catch (error) {
      console.error('Failed to create invite link: ' + error);
      message.reply('Failed to create invite link');
    }
  }
});

client.login(process.env.DXL_DISCORD_BOT_TOKEN);
