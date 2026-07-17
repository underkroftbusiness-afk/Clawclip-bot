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

// 🧩 CHANGE THIS
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";

// ✅ Bot online
client.once('clientReady', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  // 🎟️ Support message
  const supportChannel = await client.channels.fetch(SUPPORT_CHANNEL_ID);
  const supportMessages = await supportChannel.messages.fetch({ limit: 20 });
  const supportExisting = supportMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!supportExisting) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Need help?')
      .setDescription('Click the button below to open a support ticket.')
      .setFooter({ text: 'Underclips Support System' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎟️ Open Support Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await supportChannel.send({ embeds: [embed], components: [row] });
  }

  // 📜 RULES MESSAGE (BLACK + NUMBERED + UNDERCLIPS)
  const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);
  const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
  const rulesExisting = rulesMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!rulesExisting) {
    const rulesEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Rules📜')
      .setDescription(
        "**1. Respect Everyone**\n" +
        "Treat everyone normally. No toxicity, hate, or insults.\n\n" +

        "**2. No Spam**\n" +
        "No spam, caps spam, ping spam, or repeated messages.\n\n" +

        "**3. Stay On Topic**\n" +
        "Use channels for their intended purpose.\n\n" +

        "**4. No NSFW**\n" +
        "No NSFW, gore, or inappropriate content.\n\n" +

        "**5. No Self‑Promo**\n" +
        "No advertising your socials, servers, or services.\n\n" +

        "**6. Follow Staff**\n" +
        "Follow instructions from admins and moderators.\n\n" +

        "**7. Keep It Safe**\n" +
        "No threats, no sharing private info, no unsafe behavior.\n\n" +

        "**8. No Illegal Content**\n" +
        "No hacks, scams, leaks, or illegal downloads.\n\n" +

        "**9. No Doxing**\n" +
        "Do not share anyone’s private information — addresses, numbers, names, school, workplace, IPs, anything.\n\n" +

        "**10. Follow Discord Guidelines**\n" +
        "We follow the official Discord Terms of Service and Community Guidelines at all times."
      )
      .setFooter({ text: 'Underclips Server Rules' });

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }
});

// 💬 Auto‑DM when someone joins
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Welcome to Underclips — The Clipping Server That Helps You!\n\nUnderclips is a place made for people who clip. You join, you get support, you grow, and you find chances to earn more from your content. It’s a server built to make clipping easier and help you improve.`
    );
  } catch {
    console.log('Could not send DM.');
  }
});

// 🎟️ Ticket creation & closing
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  // 🟢 Create ticket
  if (interaction.customId === 'create_ticket') {
    await interaction.deferReply({ ephemeral: true });

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
      ]
    });

    const ticketEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('🎫 Ticket Created')
      .setDescription(`Welcome <@${interaction.user.id}>!\nSomeone will help you shortly.`)
      .setFooter({ text: 'Underclips Support' });

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Close Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ embeds: [ticketEmbed], components: [closeRow] });
    await interaction.editReply({ content: `✅ Your ticket has been created: ${ticketChannel}` });
  }

  // 🔒 Close ticket (ONLY ticket owner)
  if (interaction.customId === 'close_ticket') {
    const channel = interaction.channel;
    const isOwner = channel.name.includes(interaction.user.username);

    if (!isOwner) {
      return interaction.reply({ content: "Only the ticket owner can close this.", ephemeral: true });
    }

    await interaction.reply({ content: "Ticket closed. Deleting in 3 seconds...", ephemeral: true });
    setTimeout(() => channel.delete().catch(() => {}), 3000);
  }
});

// 🏓 Ping command
client.on('messageCreate', (message) => {
  if (message.content === '!ping') message.reply('Pong!');
});

// 🔑 Login
client.login(process.env.DISCORD_TOKEN);



