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
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";

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

  // 📜 RULES MESSAGE
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
        "**1. Respect Everyone** Be kind and mature. No hate, drama, or toxic behavior.\n" +
        "**2. No Spam** Don’t flood chats with messages, caps, or pings.\n" +
        "**3. Stay On Topic** Use channels for their purpose.\n" +
        "**4. No NSFW** No sexual, violent, or disturbing content.\n" +
        "**5. No Self‑Promo** Don’t advertise socials or servers unless staff approves.\n" +
        "**6. Follow Staff** Admins and mods make final decisions. Respect their instructions.\n" +
        "**7. Keep It Safe** No threats, harassment, or sharing private info.\n" +
        "**8. No Illegal Content** No hacks, cheats, scams, or leaked files.\n" +
        "**9. No Doxing** Never share personal information.\n" +
        "**10. Discord Guidelines** Follow Discord’s Terms of Service and Community Guidelines."
      )
      .setFooter({ text: 'Underclips Server Rules' });

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }

  // 💰 CAMPAIGN INFO (SHORT + SPACED)
  const campaignInfoChannel = await client.channels.fetch(CAMPAIGN_INFO_CHANNEL_ID);
  const campaignMessages = await campaignInfoChannel.messages.fetch({ limit: 20 });
  const campaignExisting = campaignMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!campaignExisting) {
    const payoutEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('💰 Payout Information')
      .setDescription(
        "**Payrate Based System**\n\nYou earn a fixed amount per views. Example: $1 per 1,000 views = $1 every time you hit 1,000 views.\n\n" +
        "**Pot Style System**\n\nYou earn based on your share of total campaign views. If you make 20% of all views, you get 20% of the budget. We take 30% of your earnings.\n\n" +
        "**Minimum Views (Individual Posts)**\n\nA post must reach at least 1,000 views before it counts.\n\n" +
        "**Payout Timelines**\n\nPayments are sent only after the campaign ends, posts are reviewed, and the sponsor approves.\n\n" +
        "**Payment Method**\n\nYou are paid through the method chosen by the campaign (e.g., PayPal).\n\n" +
        "**Payment Details**\n\nYour payout goes to the payment info saved at campaign end. If you can’t withdraw it, you must fix that yourself."
      )
      .setFooter({ text: 'Underclips Campaign Info' });

    await campaignInfoChannel.send({ embeds: [payoutEmbed] });
  }

  // 📋 CAMPAIGN RULES (SHORT + SPACED)
  const campaignRulesChannel = await client.channels.fetch(CAMPAIGN_RULES_CHANNEL_ID);
  const campaignRulesMessages = await campaignRulesChannel.messages.fetch({ limit: 20 });
  const campaignRulesExisting = campaignRulesMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!campaignRulesExisting) {
    const campaignRulesEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📋 Campaign Rules')
      .setDescription(
        "**No Botting or Fake Engagement**\n\nAll engagement must be real. No bots or fake groups.\n\n" +
        "**Audience Must Match the Campaign**\n\nJoin only if your audience fits the campaign. English campaigns require at least 50% English audience.\n\n" +
        "**Follow Campaign Requirements**\n\nPosts must follow all rules. Breaking requirements means your post won’t be accepted.\n\n" +
        "**Do Not Hide Engagement Metrics**\n\nLikes, views, and comments must stay visible.\n\n" +
        "**No Low‑Effort or Auto‑Generated Posts**\n\nPosts must be real and high‑quality.\n\n" +
        "**No Duplicate Posts**\n\nDo not upload the same post twice on the same account.\n\n" +
        "**Posts Must Stay Public Until Payment**\n\nYour post must stay public until payout is sent.\n\n" +
        "**Staff Decisions Are Final**\n\nBreaking rules gives staff full authority to act."
      )
      .setFooter({ text: 'Underclips Campaign Rules' });

    await campaignRulesChannel.send({ embeds: [campaignRulesEmbed] });
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







