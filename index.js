const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  EmbedBuilder
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

// STAFF ROLE ID (change this!)
const STAFF_ROLE_ID = "YOUR_STAFF_ROLE_ID";

// ✅ Bot online
client.once('clientReady', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  // 🎫 Support channel message
  const supportChannelId = "1516092800469303437"; 
  const supportChannel = await client.channels.fetch(supportChannelId);

  const supportMessages = await supportChannel.messages.fetch({ limit: 20 });
  const supportExisting = supportMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!supportExisting) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Need help?')
      .setDescription('Click the button below to open a support ticket.')
      .setFooter({ text: 'ClawClips Support System' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎟️ Open Support Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await supportChannel.send({
      embeds: [embed],
      components: [row]
    });
  }

  // 📜 RULES MESSAGE
  const rulesChannelId = "1516812179410780261"; 
  const rulesChannel = await client.channels.fetch(rulesChannelId);

  const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
  const rulesExisting = rulesMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!rulesExisting) {
    const rulesEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('rules📜')
      .setDescription(
        "**Respect Everyone**\n" +
        "Treat everyone normally. No toxicity, hate, or insults.\n\n" +

        "**No Spam**\n" +
        "No spam, caps spam, ping spam, or repeated messages.\n\n" +

        "**Stay On Topic**\n" +
        "Use channels for their intended purpose.\n\n" +

        "**No NSFW**\n" +
        "No NSFW, gore, or inappropriate content.\n\n" +

        "**No Self‑Promo**\n" +
        "No advertising your socials, servers, or services.\n\n" +

        "**Follow Staff**\n" +
        "Follow instructions from admins and moderators.\n\n" +

        "**Keep It Safe**\n" +
        "No threats, no sharing private info, no unsafe behavior.\n\n" +

        "**No Illegal Content**\n" +
        "No hacks, scams, leaks, or illegal downloads.\n\n" +

        "**No Doxing**\n" +
        "Do not share anyone’s private information — addresses, numbers, names, school, workplace, IPs, anything.\n\n" +

        "**Follow Discord Guidelines**\n" +
        "We follow the official Discord Terms of Service and Community Guidelines at all times."
      )
      .setFooter({ text: 'ClawClips Server Rules' });

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }
});

// 💬 Auto-DM when someone joins
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Welcome to ClawClips — The Clipping Server That Helps You!\n\nClawClips is a place made for people who clip. You join, you get support, you grow, and you find chances to earn more from your content. It’s a server built to make clipping easier and help you improve.`
    );
  } catch (err) {
    console.log('Could not send DM.');
  }
});

// 🎟️ Create ticket
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {
    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
        { id: STAFF_ROLE_ID, allow: ['ViewChannel', 'SendMessages'] }
      ]
    });

    const ticketEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('🎫 Ticket Created')
      .setDescription(`Welcome <@${interaction.user.id}>!\nA staff member will help you shortly.`)
      .setFooter({ text: 'ClawClips Support' });

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Close Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({
      embeds: [ticketEmbed],
      components: [closeRow]
    });

    await interaction.reply({
      content: `Your ticket has been created: ${ticketChannel}`,
      ephemeral: true
    });
  }

  // 🔒 Close ticket (user + staff only)
  if (interaction.customId === 'close_ticket') {
    const channel = interaction.channel;

    const isStaff = interaction.member.roles.cache.has(STAFF_ROLE_ID);
    const isOwner = channel.name.includes(interaction.user.username);

    if (!isStaff && !isOwner) {
      return interaction.reply({
        content: "You can't close this ticket.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "Ticket closed. Deleting in 3 seconds...",
      ephemeral: true
    });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 3000);
  }
});

// 🏓 Ping command
client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// 🔑 Login with Railway token
client.login(process.env.DISCORD_TOKEN);



