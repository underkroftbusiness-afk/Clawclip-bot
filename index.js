const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// ✅ Bot online
client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  // 🎟️ Ticket-knop in support kanaal
  const supportChannelId = "YOUR_SUPPORT_CHANNEL_ID"; // <-- zet hier jouw kanaal ID

  const channel = await client.channels.fetch(supportChannelId);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎟️ Open Support Ticket')
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({
    content: "Need help? Click the button below to open a support ticket.",
    components: [row]
  });
});

// 💬 Auto-DM bij join
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Join ClawClips — The Clipping Server That Helps You!\n\nClawClips is a place made for people who clip. You join, you get support, you grow, and you find chances to earn more from your content. It’s a server built to make clipping easier and help you improve.`
    );
  } catch (err) {
    console.log('Kon geen DM sturen.');
  }
});

// 🎟️ Ticket aanmaken
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
      ]
    });

    await interaction.reply({
      content: `Your ticket has been created: ${channel}`,
      ephemeral: true
    });
  }
});

// 🏓 Ping command
client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// 🔑 Login met token uit Railway
client.login(process.env.DISCORD_TOKEN);


