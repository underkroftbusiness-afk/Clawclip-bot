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

// CHANNEL IDs
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";
const HOW_TO_CLIP_CHANNEL_ID = "1534171904137625631";

const WORK_WITH_US_CHANNEL_ID = "1532762065758978190";
const APPLICATION_CHANNEL_ID = "1534208165443404020";

// BOT READY
client.once('ready', async () => {
  console.log(`Bot online as ${client.user.tag}`);
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
        "**1. Respect Everyone** Be kind and mature.\n" +
        "**2. No Spam** Don’t flood chats.\n" +
        "**3. Stay On Topic** Use channels correctly.\n" +
        "**4. No NSFW** No sexual or disturbing content.\n" +
        "**5. No Self‑Promo** Unless staff approves.\n" +
        "**6. Follow Staff** Their decisions are final.\n" +
        "**7. Keep It Safe** No threats or harassment.\n" +
        "**8. No Illegal Content** No hacks or scams.\n" +
        "**9. No Doxing** Never share personal info.\n" +
        "**10. Discord Guidelines** Follow ToS."
      )
      .setFooter({ text: 'Underclips Server Rules' });

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }

  // 💰 CAMPAIGN INFO
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
        "**Payrate System** Earn a fixed amount per views.\n\n" +
        "**Pot System** Earn based on your share of total views.\n\n" +
        "**Minimum Views** 1,000 views required.\n\n" +
        "**Payout Timeline** Paid after campaign ends.\n\n" +
        "**Payment Method** Depends on sponsor.\n\n" +
        "**Payment Details** Sent to your saved payout info."
      )
      .setFooter({ text: 'Underclips Campaign Info' });

    await campaignInfoChannel.send({ embeds: [payoutEmbed] });
  }

  // 📋 CAMPAIGN RULES
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
        "**Real Engagement Only** No bots.\n\n" +
        "**Audience Must Match** English campaigns need 50%+ English audience.\n\n" +
        "**Follow Requirements** Breaking rules = rejected.\n\n" +
        "**Do Not Hide Metrics** Keep stats visible.\n\n" +
        "**No Low‑Effort Posts** Must be real content.\n\n" +
        "**No Duplicate Posts** No double uploads.\n\n" +
        "**Posts Stay Public** Until payout.\n\n" +
        "**Staff Decisions Final** Breaking rules = action."
      )
      .setFooter({ text: 'Underclips Campaign Rules' });

    await campaignRulesChannel.send({ embeds: [campaignRulesEmbed] });
  }

  // 📘 CLIPPING TIPS
  const clipChannel = await client.channels.fetch(HOW_TO_CLIP_CHANNEL_ID);
  const clipMessages = await clipChannel.messages.fetch({ limit: 20 });
  const clipExisting = clipMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!clipExisting) {
    const clipEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📘Clipping-tips')
      .setDescription(
        "**The Hook**\nYour first 3 seconds decide if viewers stay.\n\n" +
        "**Clip Selection & Length**\nShort clips perform best.\n\n" +
        "**Editing**\nUse CapCut or OpusClip.\n\n" +
        "**Posting Strategy**\nPost consistently."
      )
      .setFooter({ text: 'Underclips Clipping Guide' });

    await clipChannel.send({ embeds: [clipEmbed] });
  }

  // 📋 UNDERCLIPS — SUBMIT A REQUEST
  const workChannel = await client.channels.fetch(WORK_WITH_US_CHANNEL_ID);
  const workMessages = await workChannel.messages.fetch({ limit: 20 });
  const workExisting = workMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!workExisting) {
    const workEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📋 Underclips — Submit a Request')
      .setDescription(
        "📝 **Service Submission**\nOffer your services or create a campaign.\n\n" +
        "🛡️ **Moderator**\nApply to be a moderator.\n\n" +
        "———————————————\nClick a button below to begin."
      )
      .setFooter({ text: 'Underclips — Applications' });

    const workRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('apply_service')
        .setLabel('📝 Service Submission')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('apply_moderator')
        .setLabel('🛡️ Moderator')
        .setStyle(ButtonStyle.Danger)
    );

    await workChannel.send({ embeds: [workEmbed], components: [workRow] });
  }
});
// 👋 AUTO DM ON JOIN
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Welcome to Underclips.\n\nUnderclips is built for clippers who want to grow, improve, and earn from their content.`
    );
  } catch {
    console.log('Could not send DM.');
  }
});

// 🎯 INTERACTION HANDLER
client.on('interactionCreate', async (interaction) => {

  // BUTTON HANDLING
  if (interaction.isButton()) {

    // 🎟️ CREATE SUPPORT TICKET
    if (interaction.customId === 'create_ticket') {
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
        .setDescription(
          `Welcome <@${interaction.user.id}>.\nSomeone will help you shortly.\n\n` +
          `If your issue is solved, press the button below to close your ticket.`
        )
        .setFooter({ text: 'Underclips Support' });

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Close Ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ embeds: [ticketEmbed], components: [closeRow] });

      await interaction.editReply({
        content: `Your ticket has been created: ${ticketChannel}`,
        ephemeral: true
      });
    }

    // 🔒 CLOSE SUPPORT TICKET
    if (interaction.customId === 'close_ticket') {
      const channel = interaction.channel;
      const isOwner = channel.name.includes(interaction.user.username);

      if (!isOwner) {
        return interaction.reply({
          content: "Only the ticket owner can close this.",
          ephemeral: true
        });
      }

      await interaction.reply({
        content: "Ticket closed. Deleting in 3 seconds...",
        ephemeral: true
      });

      setTimeout(() => channel.delete().catch(() => {}), 3000);
    }
    // 📝 SERVICE SUBMISSION FORM
    if (interaction.customId === 'apply_service') {
      await interaction.showModal({
        custom_id: 'service_form',
        title: '📝 Service Submission',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'contact',
                label: 'Contact (Telegram / Email / Discord)',
                style: 1,
                placeholder: 'Share the platforms you use so we can contact you.',
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'service_details',
                label: 'What service are you offering?',
                style: 2,
                placeholder: 'Describe the service you want to provide.',
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'pricing',
                label: 'Pricing / Payment Terms',
                style: 1,
                placeholder: 'Explain how you prefer payments to be handled.',
                required: false
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'portfolio',
                label: 'Past Work (Optional)',
                style: 2,
                placeholder: 'Send screenshots or explain your experience.',
                required: false
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'extra_info',
                label: 'Anything we should know?',
                style: 2,
                placeholder: 'Add any extra details important for your service.',
                required: false
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'questions',
                label: 'Do you have any questions for us?',
                style: 2,
                placeholder: 'If anything is unclear, ask here.',
                required: false
              }
            ]
          }
        ]
      });
    }

    // 🛡️ MODERATOR APPLICATION FORM
    if (interaction.customId === 'apply_moderator') {
      await interaction.showModal({
        custom_id: 'moderator_form',
        title: '🛡️ Moderator Application',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'basic_info',
                label: 'Basic Info (Discord @ / Age)',
                style: 1,
                placeholder: 'Share your Discord @ and your age.',
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'timezone',
                label: 'Timezone',
                style: 1,
                placeholder: 'Tell us your timezone.',
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'activity',
                label: 'Activity',
                style: 1,
                placeholder: 'Explain how active you can be.',
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'reason',
                label: 'Why do you want to be a moderator?',
                style: 2,
                placeholder: 'Explain why you want to join the moderator team.',
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'experience',
                label: 'Moderator Experience',
                style: 2,
                placeholder: 'Describe any moderation experience you have.',
                required: false
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'questions',
                label: 'Do you have any questions for us?',
                style: 2,
                placeholder: 'If anything is unclear, ask here.',
                required: false
              }
            ]
          }
        ]
      });
    }
    // 🟩 ACCEPT APPLICATION
    if (interaction.customId.startsWith('accept_application_')) {
      const userId = interaction.customId.replace('accept_application_', '');

      const ticketChannel = await interaction.guild.channels.create({
        name: `application-${userId}`,
        type: 0,
        topic: `Application accepted for ${userId}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages
            ]
          },
          {
            id: userId,
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

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`staff_close_${ticketChannel.id}`)
          .setLabel('🔒 Close Ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({
        content:
          `**Your submission has been accepted.**\n` +
          `A ticket will now be opened so we can discuss the details with you.\n` +
          `We will assist you shortly.`,
        components: [closeRow]
      });

      await interaction.reply({
        content: `Accepted — Ticket created: ${ticketChannel}`,
        ephemeral: false
      });
    }

    // 🟥 DENY APPLICATION
    if (interaction.customId.startsWith('deny_application_')) {
      const userId = interaction.customId.replace('deny_application_', '');

      await interaction.reply({
        content:
          `🟥 **Denied** by <@${interaction.user.id}>\n\n` +
          `**Your submission has been reviewed and was not approved.**\n` +
          `If you believe this is a mistake or need clarification, you may contact staff for more information in the support channel.`,
        ephemeral: false
      });
    }

    // 🔒 STAFF CLOSE APPLICATION TICKET
    if (interaction.customId.startsWith('staff_close_')) {
      const channelId = interaction.customId.replace('staff_close_', '');
      const channel = interaction.guild.channels.cache.get(channelId);

      if (!channel) {
        return interaction.reply({
          content: "Channel not found.",
          ephemeral: true
        });
      }

      await interaction.reply({
        content: "Ticket closed. Deleting in 3 seconds...",
        ephemeral: true
      });

      setTimeout(() => channel.delete().catch(() => {}), 3000);
    }
  }
  // 📝 MODAL SUBMISSION HANDLING
  if (interaction.isModalSubmit()) {

    // SERVICE FORM SUBMISSION
    if (interaction.customId === 'service_form') {
      const contact = interaction.fields.getTextInputValue('contact');
      const service_details = interaction.fields.getTextInputValue('service_details');
      const pricing = interaction.fields.getTextInputValue('pricing');
      const portfolio = interaction.fields.getTextInputValue('portfolio');
      const extra_info = interaction.fields.getTextInputValue('extra_info');
      const questions = interaction.fields.getTextInputValue('questions');

      const appChannel = await interaction.guild.channels.fetch(APPLICATION_CHANNEL_ID);

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('📝 New Service Submission')
        .setDescription(
          `**User:** <@${interaction.user.id}>\n\n` +
          `**Contact:** ${contact}\n\n` +
          `**Service:** ${service_details}\n\n` +
          `**Pricing:** ${pricing || "None"}\n\n` +
          `**Portfolio:** ${portfolio || "None"}\n\n` +
          `**Extra Info:** ${extra_info || "None"}\n\n` +
          `**Questions:** ${questions || "None"}`
        )
        .setFooter({ text: 'Underclips — Service Submission' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`accept_application_${interaction.user.id}`)
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`deny_application_${interaction.user.id}`)
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
      );

      await appChannel.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: "Your submission has been sent.",
        ephemeral: true
      });
    }

    // MODERATOR FORM SUBMISSION
    if (interaction.customId === 'moderator_form') {
      const basic_info = interaction.fields.getTextInputValue('basic_info');
      const timezone = interaction.fields.getTextInputValue('timezone');
      const activity = interaction.fields.getTextInputValue('activity');
      const reason = interaction.fields.getTextInputValue('reason');
      const experience = interaction.fields.getTextInputValue('experience');
      const questions = interaction.fields.getTextInputValue('questions');

      const appChannel = await interaction.guild.channels.fetch(APPLICATION_CHANNEL_ID);

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('🛡️ New Moderator Application')
        .setDescription(
          `**User:** <@${interaction.user.id}>\n\n` +
          `**Basic Info:** ${basic_info}\n\n` +
          `**Timezone:** ${timezone}\n\n` +
          `**Activity:** ${activity}\n\n` +
          `**Reason:** ${reason}\n\n` +
          `**Experience:** ${experience || "None"}\n\n` +
          `**Questions:** ${questions || "None"}`
        )
        .setFooter({ text: 'Underclips — Moderator Application' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`accept_application_${interaction.user.id}`)
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`deny_application_${interaction.user.id}`)
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
      );

      await appChannel.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: "Your application has been submitted.",
        ephemeral: true
      });
    }
  }
});
});
// 🔑 BOT LOGIN
client.login(process.env.TOKEN);








