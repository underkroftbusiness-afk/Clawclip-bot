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

const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";
const PARTNER_WITH_US_CHANNEL_ID = "1532762065758978190";

client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  const supportChannel = await client.channels.fetch(SUPPORT_CHANNEL_ID);
  const supportMessages = await supportChannel.messages.fetch({ limit: 20 });
  const supportExisting = supportMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

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

  const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);
  const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
  const rulesExisting = rulesMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

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

  const campaignInfoChannel = await client.channels.fetch(CAMPAIGN_INFO_CHANNEL_ID);
  const campaignMessages = await campaignInfoChannel.messages.fetch({ limit: 20 });
  const campaignExisting = campaignMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

  if (!campaignExisting) {
    const payoutEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('💰 Payout Information')
      .setDescription(
        "**Payrate Based System**\n\nYou earn a fixed amount per views.\n\n" +
        "**Pot Style System**\n\nYou earn based on your share of total campaign views.\n\n" +
        "**Minimum Views**\n\nA post must reach at least 1,000 views.\n\n" +
        "**Payout Timelines**\n\nPayments are sent after campaign review.\n\n" +
        "**Payment Method**\n\nChosen by the sponsor.\n\n" +
        "**Payment Details**\n\nYour payout goes to the saved payment info."
      )
      .setFooter({ text: 'Underclips Campaign Info' });

    await campaignInfoChannel.send({ embeds: [payoutEmbed] });
  }

  const campaignRulesChannel = await client.channels.fetch(CAMPAIGN_RULES_CHANNEL_ID);
  const campaignRulesMessages = await campaignRulesChannel.messages.fetch({ limit: 20 });
  const campaignRulesExisting = campaignRulesMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

  if (!campaignRulesExisting) {
    const campaignRulesEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📋 Campaign Rules')
      .setDescription(
        "**No Botting**\n\nAll engagement must be real.\n\n" +
        "**Audience Must Match**\n\nEnglish campaigns require 50% English audience.\n\n" +
        "**Follow Requirements**\n\nPosts must follow all rules.\n\n" +
        "**Do Not Hide Metrics**\n\nLikes, views, comments must stay visible.\n\n" +
        "**No Low‑Effort Posts**\n\nPosts must be real and high‑quality.\n\n" +
        "**No Duplicate Posts**\n\nDo not upload the same post twice.\n\n" +
        "**Posts Must Stay Public**\n\nUntil payout is sent.\n\n" +
        "**Staff Decisions Are Final**"
      )
      .setFooter({ text: 'Underclips Campaign Rules' });

    await campaignRulesChannel.send({ embeds: [campaignRulesEmbed] });
  }

  const partnerChannel = await client.channels.fetch(PARTNER_WITH_US_CHANNEL_ID);
  const partnerMessages = await partnerChannel.messages.fetch({ limit: 20 });
  const partnerExisting = partnerMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

  if (!partnerExisting) {
    const partnerEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('🤝 Underclips — Partner With Us')
      .setDescription(
        "**📝 Service Submission**\n" +
        "Submit a service you can provide or a project you want to collaborate on.\n\n" +
        "**🛡️ Moderator**\n" +
        "Apply to be a moderator and help support the community.\n\n" +
        "———————————————\nClick a button below to begin."
      )
      .setFooter({ text: 'Underclips — Applications' });

    const partnerRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('apply_service')
        .setLabel('Service Submission')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('apply_moderator')
        .setLabel('Moderator')
        .setStyle(ButtonStyle.Danger)
    );

    await partnerChannel.send({ embeds: [partnerEmbed], components: [partnerRow] });
  }
});
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Welcome to Underclips — The Clipping Server That Helps You!`
    );
  } catch {
    console.log('Could not send DM.');
  }
});

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
        .setDescription(`Welcome <@${interaction.user.id}>! Someone will help you shortly.`)
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
        content: '⚠️ Something went wrong while creating your ticket.',
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
client.on('messageCreate', (message) => {
  if (message.content === '!ping') message.reply('Pong!');
});
client.login(process.env.DISCORD_TOKEN);







