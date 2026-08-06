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
const HOW_TO_CLIP_CHANNEL_ID = "1534171904137625631";

// 🧩 NEW SYSTEM CHANNEL
const WORK_WITH_US_CHANNEL_ID = "YOUR_CHANNEL_ID_HERE"; // <— CHANGE THIS
const STAFF_CHANNEL_ID = "YOUR_STAFF_CHANNEL_ID_HERE";  // <— CHANGE THIS

// 🔑 Bot online
client.once('ready', async () => {
  console.log(`🔑 Bot is online as ${client.user.tag}`);

  // 🎟️ Support message
  const supportChannel = await client.channels.fetch(SUPPORT_CHANNEL_ID);
  const supportMessages = await supportChannel.messages.fetch({ limit: 20 });
  const supportExisting = supportMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!supportExisting) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('❓ Need help?')
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

  // 📘 ORIGINAL CLIPPING-TIPS — RESTORED EXACTLY
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
        "**The Hook**\nYour first 3 seconds decide if viewers stay. Strong openings increase watch time and push your video further. Create quick curiosity or emotion.\n\n" +
        "**Clip Selection & Length**\nChoose moments that feel viral or instantly grab attention. Short clips perform best. IG: ~40s • TikTok: ~30s • Shorts: 15–20s.\n\n" +
        "**Editing**\nYou can use CapCut or OpusClip to edit your clips. Add clear, bold captions to keep viewers focused, and choose trending audio to help the algorithm push your content further.\n\n" +
        "**Posting Strategy**\nPost consistently throughout the day. Use hashtags that match your niche."
      )
      .setFooter({ text: 'Underclips Clipping Guide' });

    await clipChannel.send({ embeds: [clipEmbed] });
  }

  // 📋 SUBMIT A REQUEST — NEW SYSTEM
  const workChannel = await client.channels.fetch(WORK_WITH_US_CHANNEL_ID);
  const workMessages = await workChannel.messages.fetch({ limit: 20 });
  const workExisting = workMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!workExisting) {
    const workEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📋 Submit a Request')
      .setDescription(
        "📝 **Service Submission**\n" +
        "Interested in offering your services or creating your own campaign? Submit your details and we will review your request.\n\n" +
        "🛡️ **Moderator**\n" +
        "Apply to be a moderator and support the community. Submit your details to begin.\n\n" +
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

// 👋 Auto DM
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Welcome to Underclips.\n\nUnderclips is built for clippers who want to grow, improve, and earn from their content.`
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
        .setDescription(`Welcome <@${interaction.user.id}>. Someone will help you shortly.\nIf your issue is solved, press the button below to close your ticket.`)
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

    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: 'Something went wrong while creating your ticket.',
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
              label: 'Contact Information',
              style: 1,
              placeholder: 'Discord tag, email, etc.',
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
              label: 'Service Details',
              style: 2,
              placeholder: 'Describe your service or campaign idea',
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
              label: 'Pricing / Rates',
              style: 1,
              placeholder: 'Your pricing or payment terms',
              required: false
            }
          ]
        }
      ]
    });
  }

  // 🛡️ MODERATOR FORM
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
              custom_id: 'age',
              label: 'Your Age',
              style: 1,
              placeholder: 'Enter your age',
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
              placeholder: 'Explain why you want the role',
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
              label: 'Moderation Experience',
              style: 2,
              placeholder: 'Describe any past moderation experience (optional)',
              required: false
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'activity',
              label: 'How active can you be?',
              style: 1,
              placeholder: 'Daily hours or schedule',
              required: true
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'extra',
              label: 'Anything else?',
              style: 2,
              placeholder: 'Optional additional info',
              required: false
            }
          ]
        }
      ]
    });
  }
});

// FORM SUBMISSIONS
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  // 📝 SERVICE SUBMISSION
  if (interaction.customId === 'service_form') {
    const contact = interaction.fields.getTextInputValue('contact');
    const details = interaction.fields.getTextInputValue('service_details');
    const pricing = interaction.fields.getTextInputValue('pricing');

    const staffChannel = await client.channels.fetch(STAFF_CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📝 New Service Submission')
      .addFields(
        { name: 'Contact', value: contact },
        { name: 'Details', value: details },
        { name: 'Pricing', value: pricing || 'Not provided' }
      )
      .setFooter({ text: 'Underclips Applications' });

    await staffChannel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Your submission has been sent.', ephemeral: true });
  }

  // 🛡️ MODERATOR SUBMISSION
  if (interaction.customId === 'moderator_form') {
    const age = interaction.fields.getTextInputValue('age');
    const reason = interaction.fields.getTextInputValue('reason');
    const experience = interaction.fields.getTextInputValue('experience');
    const activity = interaction.fields.getTextInputValue('activity');
    const extra = interaction.fields.getTextInputValue('extra');

    const staffChannel = await client.channels.fetch(STAFF_CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('🛡️ New Moderator Application')
      .addFields(
        { name: 'Age', value: age },
        { name: 'Reason', value: reason },
        { name: 'Experience', value: experience || 'None provided' },
        { name: 'Activity', value: activity },
        { name: 'Extra Info', value: extra || 'None' }
      )
      .setFooter({ text: 'Underclips Applications' });

    await staffChannel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Your application has been submitted.', ephemeral: true });
  }
});

// 🏓 Ping command
client.on('messageCreate', (message) => {
  if (message.content === '!ping') message.reply('🏓 Pong!');
});

// 🔑 Login
client.login(process.env.DISCORD_TOKEN);


  
