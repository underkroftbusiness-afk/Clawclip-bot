const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField
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

// 🧩 CHANGE THESE
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";

// ✅ Bot online
client.once('ready', async () => {
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

  // 📜 RULES MESSAGE (UPDATED TEXT ONLY)
  const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);
  const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
  const rulesExisting = rulesMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!rulesExisting) {
    const rulesEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📜 Rules')
      .setDescription(
        "**1. Respect Everyone** Treat all members with respect. No toxicity, bullying, discrimination, or drama. Keep conversations friendly and mature.\n" +
        "**2. No Spam** Avoid flooding chats with repeated messages, caps, or random pings. Keep the chat readable for everyone.\n" +
        "**3. Stay On Topic** Use each channel for its purpose. It helps keep the server organized and easy to navigate.\n" +
        "**4. No NSFW** Sexual content, gore, or anything unsafe is strictly forbidden. This server must stay safe for all users.\n" +
        "**5. No Self‑Promo** Don’t advertise socials, servers, or services unless staff approves it. Keep focus on clipping and growth.\n" +
        "**6. Follow Staff** Admins and moderators make final decisions. Cooperate when asked and respect their guidance.\n" +
        "**7. Keep It Safe** No threats, harassment, or sharing private info. Everyone should feel safe here.\n" +
        "**8. No Illegal Content** No hacks, cheats, scams, or leaked files. Don’t share or request pirated material.\n" +
        "**9. No Doxing** Never share private info — names, addresses, numbers, schools, workplaces, IPs, anything personal.\n" +
        "**10. Discord Guidelines** Follow Discord’s Terms of Service and Community Guidelines at all times."
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
    try {
      await interaction.deferReply({ ephemeral: true });

      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: 0,
        topic: `Support ticket for ${interaction.user.tag}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages
            ]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          },
          {
            id: client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.EmbedLinks
            ]
          }
        ]
      });

      const ticketEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('🎫 Ticket Created')
        .setDescription(`Welcome <@${interaction.user.id}>! Someone will help you shortly.\nIf your issue is solved, press the button below to close your ticket.`)
        .setFooter({ text: 'Underclips Support' });

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Close Ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ embeds: [ticketEmbed], components: [closeRow] });

      await interaction.editReply({
        content: `✅ Your ticket has been created: ${ticketChannel}`,
        ephemeral: true
      });

    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: '⚠️ Something went wrong while creating your ticket.\nMake sure the bot has **Manage Channels** permission.',
        ephemeral: true
      });
    }
  }

  // 🔒 Close ticket
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









